import React, { useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import "./../styles/cart.css";
import { useNavigate } from "react-router-dom";
interface CartItemType {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    brand?: string;
    color?: string;
  };
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const token: string | null = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

const navigate = useNavigate();
  // Fetch Cart Items
  const fetchCart = async () => {
    if (!user?._id) return;
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
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  const shippingFee = 100;
  const total = subtotal + shippingFee;
  return (
    <div className="cart-page">
      {/* Left Section */}
      <div className="cart-left">
        <div className="cart-header">
        </div>

        {/* Render Items */}
        {cartItems.length === 0 ? (
          <p className="empty-cart">🛒 Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <CartItem key={item._id} item={item} refreshCart={fetchCart} />
          ))
        )}
      </div>
      <div className="cart-right">
       

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>
            Subtotal ({cartItems.length} items) <span>Rs. {subtotal}</span>
          </p>
          <p>
            Shipping Fee <span>Rs. 100</span>
          </p>
          <div className="voucher">
            <input type="text" placeholder="Enter Voucher Code" />
            <button>APPLY</button>
          </div>
          <h2>
            Total <span>Rs. {total}</span>
          </h2>
          <button className="checkout-btn" onClick={()=>{
            navigate("/checkout")
          }}>
            PROCEED TO CHECKOUT({cartItems.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
