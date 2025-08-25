// routes/debug.js
import express from "express";
const router = express.Router();

router.post("/send-test-sms", async (req, res) => {
  try {
    const { to = process.env.TWILIO_PHONE_NUMBER } = req.body;
    await sendOtpSms({ to, otp: "123456" });
    res.json({ ok: true, message: "Test SMS sent" });
  } catch (e) {
    console.error("Test SMS error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;