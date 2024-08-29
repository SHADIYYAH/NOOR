
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }, // Changed from Number to String
  createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires after 5 minutes (300 seconds)
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
