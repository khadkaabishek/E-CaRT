import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Company Info */}
        <div className="footer-section company-info">
          <h3>E-Shop</h3>
          <p>Quality products. Trusted service.</p>
          <div className="footer-contact">
            <p><FaPhoneAlt /> +977-9800000000</p>
            <p><FaEnvelope /> support@eshop.com</p>
            <p><FaMapMarkerAlt /> Kathmandu, Nepal</p>
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">All Products</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Signup</a></li>
            <li><a href="/your_cart">Your Cart</a></li>
          </ul>
        </div>

        {/* Right: Social Media */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} E-Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
