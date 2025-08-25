// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// ====== CONFIG ======
const OTP_WINDOW_MS = 5 * 60 * 1000;   // 5 min expiry
const RESEND_COOLDOWN_MS = 30 * 1000;  // 30 sec cooldown
const MAX_OTP_ATTEMPTS = 5;
const ALLOW_ANY_OTP = process.env.ALLOW_ANY_OTP === "true"; // 🚀 toggle flag

// ====== FIXED OTPs FOR TESTING ======
const TEST_OTPS = ["242004", "854624", "125976"]; // 🚀 fixed OTPs
let otpIndex = 0; // to rotate through

// Generate OTP (fixed list for testing)
const generateOtp = () => {
  const otp = TEST_OTPS[otpIndex % TEST_OTPS.length];
  otpIndex++;
  return otp;
};

// Issue JWT
const issueJwt = (user) =>
  jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/* =====================
   Register User
===================== */
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: "Username and phone are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: "User with this phone already exists" });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({
      username,
      email: email || null,
      password: hashedPassword,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   Request OTP
===================== */
router.post("/request-otp", async (req, res) => {
  const { username, phone, email } = req.body;

  if (!username || !phone) {
    return res.status(400).json({ message: "Username and phone are required" });
  }

  try {
    let user = await User.findOne({ phone });
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    if (!user) {
      user = await User.create({
        username,
        phone,
        email: email || null,
        otpHash,
        otpExpires: new Date(Date.now() + OTP_WINDOW_MS),
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      });
    } else {
      user.otpHash = otpHash;
      user.otpExpires = new Date(Date.now() + OTP_WINDOW_MS);
      user.otpAttempts = 0;
      user.lastOtpSentAt = new Date();
      if (email && email !== user.email) user.email = email;
      await user.save();
    }

    // 🔥 Directly return OTP in response (testing only)
    res.json({
      message: "OTP generated successfully",
      otp,
    });
  } catch (err) {
    console.error("Request OTP error:", err);
    res.status(500).json({ message: "Failed to process OTP request" });
  }
});

/* =====================
   Verify OTP
===================== */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (ALLOW_ANY_OTP) {
      // 🚀 Accept ANY OTP
      user.otpHash = null;
      user.otpExpires = null;
      user.otpAttempts = 0;
      await user.save();

      const token = issueJwt(user);
      return res.json({
        message: "Login successful (OTP bypassed)",
        token,
        user: { id: user._id, phone: user.phone, username: user.username, email: user.email },
      });
    }

    // === Normal OTP validation ===
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({ message: "Too many attempts. Request new OTP." });
    }

    if (!user.otpHash || !user.otpExpires) {
      return res.status(400).json({ message: "No OTP requested" });
    }

    if (Date.now() > new Date(user.otpExpires).getTime()) {
      return res.status(400).json({ message: "OTP expired. Request new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP success → issue token
    user.otpHash = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    const token = issueJwt(user);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, phone: user.phone, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   Resend OTP
===================== */
router.post("/resend-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (
      user.lastOtpSentAt &&
      Date.now() - new Date(user.lastOtpSentAt).getTime() < RESEND_COOLDOWN_MS
    ) {
      return res.status(429).json({ message: "Wait before requesting again" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpires = new Date(Date.now() + OTP_WINDOW_MS);
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();
    await user.save();

    // 🔥 Directly return OTP in response
    res.json({
      message: "OTP resent",
      otp,
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   Protected Route
===================== */
router.get("/protected", authenticate, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

export default router;
