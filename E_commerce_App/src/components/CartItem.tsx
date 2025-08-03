import React from "react";
import "./../styles/cartItem.css";

interface CartItemProps {
  item: {
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
  };
  refreshCart: () => void;
}

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

const CartItem: React.FC<CartItemProps> = ({ item, refreshCart }) => {
  const updateQuantity = async (action: "increment" | "decrement") => {
    try {
      await fetch(`http://localhost:5001/cart/${user._id}/update-quantity`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: item.product._id, action }),
      });
      refreshCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeFromCart = async () => {
    try {
      await fetch(`http://localhost:5001/cart/${user._id}/remove-item`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: item.product._id }),
      });
      refreshCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-checkbox">
        {/* <input type="checkbox" className="modern-checkbox" /> */}
      </div>
      
      <div className="cart-item-image">
        <img
          src={`http://localhost:5001/${item.product.image}`}
          alt={item.product.name}
          className="cart-item-img"
        />
      </div>
      
      <div className="cart-item-info">
        <h4 className="product-title">{item.product.name}</h4>
        <div className="product-meta">
          <span className="brand">{item.product.brand || "No Brand"}</span>
          <span className="separator">•</span>
          <span className="color">Color: {item.product.color || "Not Specified"}</span>
        </div>
      </div>
      
      <div className="cart-item-price">
        <div className="price">Rs. {item.product.price.toLocaleString()}</div>
        <div className="old-price">Rs. {(item.product.price * 2).toLocaleString()}</div>
        <div className="discount-badge">50% OFF</div>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn" 
          onClick={() => updateQuantity("decrement")} 
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button 
          className="quantity-btn" 
          onClick={() => updateQuantity("increment")}
        >
          +
        </button>
      </div>
      
      <div className="cart-item-actions">
        <button className="remove-btn" onClick={removeFromCart}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;