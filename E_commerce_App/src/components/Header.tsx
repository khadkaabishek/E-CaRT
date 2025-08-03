import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "./components/NotificationDropdown";
import "./../styles/header.css";

interface CartItemType {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

const Header: React.FC = () => {
  const token = localStorage.getItem("token") ?? "";
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleMoveToMyItems = () => {
    if (user?._id) navigate(`/${user._id}/my_items`);
  };

  const fetchCart = async () => {
    // const id = user?.id || user?._id;
    if (user?._id || user.role === "seller") return;
    try {
      const res = await fetch(`http://localhost:5001/cart/${user._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.items) setCartItems(data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(total);
  }, [cartItems]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🛍️ E-CaRT
        </Link>

        {/* ✅ Search bar only on dashboard */}
        {location.pathname === "/dashboard" && (
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
        )}

        {token && user && (
          <nav className="nav-links">
            {user.role === "admin" && (
              <button className="btn nav-btn" onClick={() => navigate("/admin")}>
                Admin Panel
              </button>
            )}
            {user.role === "seller" && (
              <>
                <button className="btn nav-btn" onClick={() => navigate("/add-item")}>
                  Add Item
                </button>
                <button className="btn nav-btn" onClick={() => navigate("/analytics")}>
                  Analytics
                </button>
                <button className="btn nav-btn" onClick={handleMoveToMyItems}>
                  My Products
                </button>
              </>
            )}
            {user.role === "user" && (
              <>
                <button className="btn nav-btn" onClick={() => navigate("/dashboard")}>
                  All Products
                </button>
                <button className="btn nav-btn cart-btn" onClick={() => navigate("/your_cart")}>
                  Your Cart
                  {totalQuantity > 0 && (
                    <span className="cart-badge">{totalQuantity}</span>
                  )}
                </button>
              </>
            )}
          </nav>
        )}

        {/* ✅ Right Section: Orders, Become Seller, Notifications */}
        <div className="right-section">
          {token && user && (
            <>
              {user.role === "user" && (
                <>
                  <button
                    className="btn nav-btn"
                    onClick={() => navigate('/myOrders')}
                  >
                    My Orders
                  </button>
                  <button
                    className="btn nav-btn"
                    onClick={() => navigate('/become_seller')}
                  >
                    Become a Seller
                  </button>
                </>
              )}

              {user.role === "seller" && (
                <button
                  className="btn nav-btn"
                  onClick={() => navigate('/Orders')}
                >
                  Orders
                </button>
              )}

              <NotificationDropdown />
            </>
          )}

          {/* ✅ User Profile Section */}
          <div className="user-section">
            {token && user ? (
              <div className="profile-container" ref={profileRef}>
                <img
                  src={user?.image || "/images.png"}
                  className="user-avatar"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                />
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <p className="profile-name">{user?.name || user?.email}</p>
                    <button
                      className="dropdown-btn"
                      onClick={() => navigate("/profile")}
                    >
                      View Profile
                    </button>
                    <button className="dropdown-btn logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <nav className="nav-links auth-links">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Signup
                </Link>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
