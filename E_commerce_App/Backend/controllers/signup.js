const nodemailer = require("nodemailer");
const User = require("./../models/user");

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
    subject: "Verify your email",
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
}

async function handleSignup(req, res) {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({ message: "Email already registered." });
      } else {
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        existingUser.name = name;
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;
        await existingUser.save();

        await sendOTPEmail(email, otp);
        return res.status(200).json({
          message: "OTP resent. Please verify your email.",
        });
      }
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      otp,
      otpExpiresAt,
      isVerified: false,
      password: null,
    });

    await newUser.save();
    await sendOTPEmail(email, otp);

    return res.status(201).json({
      message: "Signup initiated! Please verify your email using the OTP sent.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(200).json({ message: "Already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleCompleteSignup(req, res) {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified." });
    }

    if (user.password) {
      return res
        .status(409)
        .json({ message: "Password already set. Please login." });
    }
    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Signup completed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = { handleSignup, verifyOTP, handleCompleteSignup };
