import React from "react";
import { Link } from "react-router-dom";
import "./../../styles/home.css";

const Home: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;

  return (
    <section id="home-section" className="home-section">
      <h1 id="home-title" className="home-title">Welcome to <span className="highlight">E-Shop</span></h1>
      <p id="home-subtitle" className="home-subtitle">Your one-stop shop for all your needs. Discover top-quality products at unbeatable prices.</p>

      <div id="home-buttons" className="home-buttons">
        {isLoggedIn ? (
          user && user.role === "seller" ? (
            <Link to={`/${user._id}/my_items`} id="get-started-btn" className="btn btn-primary">
              Get Started (Seller)
            </Link>
          ) : (
            <Link to="/dashboard" id="get-started-btn" className="btn btn-primary">
              Get Started
            </Link>
          )
        ) : (
          <>
            <Link to="/login" id="login-btn" className="btn btn-login">
              Login
            </Link>
            <Link to="/signup" id="signup-btn" className="btn btn-signup">
              Signup
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
