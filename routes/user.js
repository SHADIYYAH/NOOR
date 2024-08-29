const express = require("express");
const router = express.Router();
const {
  register,
  verifyUserAccount,
  login,
  forgotPassword,
  changePassword
} = require("../controllers/user");

// Register a new user
router.post("/register", register);

// Verify user account using OTP
router.get('/verify/:otp/:email', verifyUserAccount);

// Login a user
router.post('/login', login);

// Forgot password (send OTP to user's email)
router.post('/forgot-password', forgotPassword);

// Change password (verify OTP and update password)
router.post('/change-password', changePassword);

module.exports = router;
