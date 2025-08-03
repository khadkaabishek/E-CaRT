const express = require("express");
const router = express();
const {
  handleSignup,
  verifyOTP,
  handleCompleteSignup,
} = require("./../controllers/signup.js");
const {
  handleLogin,
  handleForgotPassword,
  verifyResetOTP,
  handleResetPassword,
} = require("./../controllers/login.js");
const { googleLogin } = require("../controllers/googlelogin.js");
router.post("/signup", handleSignup);
router.post("/verify-otp", verifyOTP);
router.post("/complete-signup", handleCompleteSignup);
router.post("/login", handleLogin);
router.post("/forgot-password", handleForgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", handleResetPassword);
router.post("/login", handleLogin);

router.get("/google", googleLogin);
module.exports = router;
