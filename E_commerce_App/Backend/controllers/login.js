const nodemailer = require("nodemailer");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const MyNotification = require("./../models/notification");
const JWT_SECRET = process.env.JWT_SECRET;
async function handleLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  await MyNotification.create({
    user: user._id,
    message: ` New login detected `,
    from: "686160b656334582e44785b8",
  });

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"E-CaRT" <abishekkhadka36@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    html: `<p>Your OTP to reset password is <b>${otp}</b>. It will expire in 5 minutes.Don't share it with anyone.</p>`,
  });
}

async function handleForgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
async function verifyResetOTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.otp || user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP." });

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
async function handleResetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required for password reset." });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found." });
    await MyNotification.create({
      user: user._id,
      message: ` Your password has been reset`,
      from: "686160b656334582e44785b8",
    });

    user.password = newPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  handleLogin,
  handleForgotPassword,
  verifyResetOTP,
  handleResetPassword,
};
