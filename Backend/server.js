// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import paypal from "paypal-rest-sdk";
import crypto from "crypto";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

// Load env variables
dotenv.config();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// --- PayPal Configuration ---
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // "sandbox" or "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// --- Routes Imports ---
import kidsRoutes from "./routes/kids.js";
import productRoutes from "./routes/products.js";
import menRoutes from "./routes/men.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import debugRoutes from "./routes/debug.js";
import User from "./models/User.js";

// Use routes
app.use("/api/kids", kidsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/men", menRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/debug", debugRoutes);

// --- PayPal Routes ---
// Create PayPal payment
app.post("/api/paypal/create-payment", (req, res) => {
  const { total, currency = "USD", description = "Payment transaction" } = req.body;

  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: `${process.env.CLIENT_URL}/paypal-success`,
      cancel_url: `${process.env.CLIENT_URL}/paypal-cancel`,
    },
    transactions: [
      {
        amount: { currency, total },
        description,
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error("PayPal creation error:", error);
      return res.status(500).json({ error: "Payment creation failed" });
    }
    const approvalUrl = payment.links.find((link) => link.rel === "approval_url")?.href;
    res.json({ id: payment.id, approvalUrl });
  });
});

// Execute PayPal payment
app.post("/api/paypal/execute-payment", (req, res) => {
  const { paymentId, payerId } = req.body;
  const execute_payment_json = { payer_id: payerId };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error("PayPal execution error:", error.response || error);
      return res.status(500).json({ error: "Payment execution failed" });
    }
    res.json({ success: true, payment });
  });
});

// --- OTP SYSTEM ---
// 📌 Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- OTP Routes ---
// Send OTP
app.post("/api/otp/send", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Save or update OTP in DB
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ username: phone, phone });
    }
    user.otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpires = otpExpires;
    await user.save();

    res.json({
      message: "OTP generated successfully",
      otp, // ⚠️ return OTP directly (good for dev/testing)
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user || !user.otpHash || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > new Date(user.otpExpires).getTime()) {
      user.otpHash = null;
      user.otpExpires = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== user.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP success → clear OTP
    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "✅ OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

// --- Default Route ---
app.get("/", (req, res) => {
  res.send("🚀 API is running with Auth, PayPal & OTP (no SMS)...");
});

// --- Start Server ---
app.listen(8000, () => {
  console.log("Server running at 8000");
});
