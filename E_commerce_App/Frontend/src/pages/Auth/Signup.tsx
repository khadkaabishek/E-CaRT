import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/login.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "password">("form");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (step === "form") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (step === "password") {
      setPasswords((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sending OTP to your email...");

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ OTP sent to your email.");
        setStep("otp");
      } else {
        setMessage(result.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("Something went wrong. Try again.");
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Verifying OTP...");

    try {
      const response = await fetch("http://localhost:5001/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Email verified! Please set your password.");
        setStep("password");
      } else {
        setMessage(result.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);
      setMessage("Something went wrong.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Creating your account...");

    if (passwords.password !== passwords.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: passwords.password,
          confirmPassword: passwords.confirmPassword,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Signup completed! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(result.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Password Submit Error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>

      {step === "form" && (
        <form className="auth-form" onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>


          <button type="submit" className="auth-button">
            Send OTP
          </button>

          {message && <p className="auth-message">{message}</p>}
        </form>
      )}

      {step === "otp" && (
        <form className="auth-form" onSubmit={handleOtpVerify}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP sent to your email:</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Verify OTP
          </button>
          {message && <p className="auth-message">{message}</p>}
        </form>
      )}

      {step === "password" && (
        <form className="auth-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              required
              value={passwords.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="auth-button">
            Create Account
          </button>
          {message && <p className="auth-message">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default Signup;
