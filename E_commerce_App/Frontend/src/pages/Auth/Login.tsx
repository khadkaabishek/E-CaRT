import React, { useState } from "react";
import "./../../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api.jsx";

type LoginProps = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");

  const [forgotMode, setForgotMode] = useState<"email" | "otp" | "reset" | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        setMessage("✅ Login successful!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsAuthenticated(true);
        const user = result.user;
        if (user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        setMessage(result.error || "❌ Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("⚠️ Something went wrong. Please try again.");
    }
  };

  const responseFromGoogle = async (authResult: any) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        const { token } = result.data;
        setMessage("✅ Login successful!");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setIsAuthenticated(true);
        const user = result.data.user;
        if (user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        setMessage("❌ Invalid credentials.");
      }
    } catch (error) {
      console.log(`Error thrown : ${error}`);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseFromGoogle,
    onError: responseFromGoogle,
    flow: "auth-code",
  });

  const handleForgotPasswordEmail = async () => {
    setMessage("⏳ Sending OTP...");
    try {
      const res = await fetch("http://localhost:5001/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("📧 OTP sent to your email.");
        setForgotMode("otp");
      } else {
        setMessage(data.error || "❌ Failed to send OTP.");
      }
    } catch (err) {
      console.log(err);
      setMessage("⚠️ Something went wrong.");
    }
  };

  const handleVerifyOTP = async () => {
    setMessage("⏳ Verifying OTP...");
    try {
      const res = await fetch("http://localhost:5001/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ OTP verified. Now set new password.");
        setForgotMode("reset");
      } else {
        setMessage(data.error || "❌ Invalid OTP.");
      }
    } catch (err) {
      console.log(err);
      setMessage("⚠️ Error verifying OTP.");
    }
  };

  const handleResetPassword = async () => {
    setMessage("⏳ Resetting password...");
    try {
      const res = await fetch("http://localhost:5001/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
        setMessage("✅ Password reset successful. Please login.");
        setForgotMode(null);
      } else {
        setMessage(data.error || "❌ Failed to reset password.");
      }
    } catch (err) {
      console.log(err);
      setMessage("⚠️ Error resetting password.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{forgotMode ? "Forgot Password" : "Login"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!forgotMode && (
          <>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                required
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <p className="forgot-password-link" onClick={() => setForgotMode("email")}>
              Forgot Password?
            </p>

            <button id="google" onClick={googleLogin} type="button">
              <img
                id="google-icon"
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google icon"
              />
              Login with Google
            </button>

            <button type="submit" className="auth-button">
              Login
            </button>
          </>
        )}

        {forgotMode === "email" && (
          <>
            <div className="form-group">
              <label htmlFor="resetEmail">Enter your email:</label>
              <input
                type="email"
                name="resetEmail"
                value={resetEmail}
                required
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button type="button" className="auth-button" onClick={handleForgotPasswordEmail}>
              Send OTP
            </button>
          </>
        )}

        {forgotMode === "otp" && (
          <>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                name="otp"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
              />
            </div>
            <button type="button" className="auth-button" onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {forgotMode === "reset" && (
          <>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
            </div>
            <button type="button" className="auth-button" onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

        {forgotMode && (
          <p
            className="forgot-password-link"
            onClick={() => {
              setForgotMode(null);
              setMessage("");
              setResetEmail("");
              setOtp("");
              setNewPassword("");
            }}
          >
            ← Back to login
          </p>
        )}

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
