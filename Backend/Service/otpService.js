// services/otpService.js
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory OTP store (⚠️ use DB/Redis in production)
const otpStore = {};

export const sendOtp = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  otpStore[phone] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 min expiry
  };

  await client.messages.create({
    body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });

  return otp;
};

export const verifyOtp = (phone, otp) => {
  const data = otpStore[phone];
  if (!data) return false;
  if (Date.now() > data.expires) return false;
  if (Number(otp) !== data.otp) return false;

  delete otpStore[phone]; // OTP used, remove it
  return true;
};
