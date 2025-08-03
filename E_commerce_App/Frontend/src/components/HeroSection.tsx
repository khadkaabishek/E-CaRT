// HeroSection.tsx
import React from "react";
import "./../styles/HeroSection.css";

const HeroSection: React.FC = () => {

  const scrollToForm = () => {
    const formElement = document.getElementById("seller-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2>Grow Your Business with Us</h2>
        <p>
          Join thousands of successful sellers on our platform and reach millions of customers.
        </p>
        <button className="hero-cta" onClick={scrollToForm}>Start Selling Now</button>
      </div>
      <div className="hero-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/862/862830.png"
          alt="Grow your business"
        />
      </div>
    </section>
  );
};

export default HeroSection;
