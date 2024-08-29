require("dotenv").config();
const { Users } = require("../models/user");
const Otp = require("../models/otp");
const { userValidation } = require("../validations/user");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const {
  hashPassword,
  comparePassword,
  generateOtp,
  sendEmail,
} = require("../utils");
const jwt = require("jsonwebtoken");
const { readFileAndSendEmail } = require("../services/email");

// User Registration
const register = async (req, res, next) => {
  try {
    const { fullname, username, email, gender, password } = req.body;

    const { error } = userValidation(req.body);
    if (error) throw new Error(error.details[0].message);

    const existingUser = await Users.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const { hash, salt } = await hashPassword(password);
    const newUser = new Users({
      user_id: uuidv4(),
      fullname,
      username,
      email,
      gender,
      passwordHash: hash,
      passwordSalt: salt,
    });

    const otp = generateOtp(6);
    await newUser.save();
    await Otp.create({ email, otp });

    await readFileAndSendEmail(
      email,
      "Welcome To NOOR!",
      { fullname, otp },
      "otp"
    );

    res
      .status(201)
      .json({ status: true, message: "User account successfully created" });
  } catch (error) {
    next(error);
  }
};

// Verify User Account
const verifyUserAccount = async (req, res, next) => {
  try {
    const { otp, email } = req.params;
    if (!otp || !email) throw new Error("Bad request");

    const otpData = await Otp.findOne({ email, otp });
    if (!otpData) throw new Error("Invalid OTP");

    await Otp.deleteOne({ email, otp });
    res
      .status(200)
      .json({ status: true, message: "Account verified successfully" });
  } catch (error) {
    next(error);
  }
};

// User Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Email and password are required.");

    const user = await Users.findOne({ email });
    if (!user) throw new Error("Invalid email or password.");

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid email or password.");

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.set("Authorization", `Bearer ${token}`);
    res.status(200).json({ status: true, message: "Login successful." });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  await body("email").isEmail().withMessage("Invalid email format").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: "failed", message: errors.array()[0].msg });
  }

  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) throw new Error("User not found");

    const otp = generateOtp(6);
    await Otp.create({ email, otp });

    const subject = "Password Reset Request";
    const text = `Your OTP for password reset is ${otp}.`;
    const html = `<p>Your OTP for password reset is <strong>${otp}</strong>.</p>`;
    await sendEmail(email, subject, text, html);

    res.status(200).json({
      status: "success",
      message: "OTP has been sent to your email address.",
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpData = await Otp.findOne({ email, otp });
    if (!otpData) throw new Error("Invalid OTP");

    const { hash, salt } = await hashPassword(newPassword);
    await Users.updateOne(
      { email },
      { passwordHash: hash, passwordSalt: salt }
    );

    await Otp.deleteOne({ email, otp });
    res
      .status(200)
      .json({ status: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyUserAccount,
  login,
  forgotPassword,
  changePassword,
};
