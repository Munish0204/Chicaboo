// controllers/authController.js
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../services/otpService.js";

export const sendOtpController = async (req, res) => {
  const { phone } = req.body;
  try {
    await sendOtp(phone);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtpController = (req, res) => {
  const { phone, otp } = req.body;
  const isValid = verifyOtp(phone, otp);

  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  // ✅ Generate JWT after successful OTP verification
  const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ success: true, message: "OTP verified successfully", token });
};
