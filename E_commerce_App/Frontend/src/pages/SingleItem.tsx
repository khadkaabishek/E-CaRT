import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProductReview from "./../components/productReview";
import "./../styles/ProductDetail.css";

const backendURL = "http://localhost:5001/";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  originalPrice?: number;
  discountPercent?: number;
  quantityAvailable?: number;
  owner?: {
    name: string;
    email: string;
    official_email?:string;
  };
  image?: string;
};

const userJSON = localStorage.getItem("user");
const user = userJSON ? JSON.parse(userJSON) : null;
const token: string | null = localStorage.getItem("token");

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addToCartStatus, setAddToCartStatus] = useState<string>("");
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  const handleEdit = (product: Product) => {
    navigate(`/${product._id}/edit_item_info`, { state: { product } });
  };

  const handleDelete = async (product: Product) => {
    try {
      const response = await fetch(`${backendURL}api/delete_item/${product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        const errorData = await response.json();
        alert(errorData.message);
        setShowDeletePopUp(false);
        return;
      }
      if (!response.ok) throw Error("Delete failed");
      setShowDeletePopUp(false);
      navigate("/dashboard");
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    setProduct(null);
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendURL}api/get-item/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const gotProduct = await response.json();
        setProduct(gotProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
  
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (quantity < 1) {
      setAddToCartStatus("Quantity must be at least 1");
      return;
    }
    if (product.quantityAvailable && quantity > product.quantityAvailable) {
      setAddToCartStatus(`Only ${product.quantityAvailable} items available`);
      return;
    }
    if (!user) {
      setAddToCartStatus("Please login to add items to your cart");
      return;
    }
    const payload = {
      product: product._id,
      quantity,
      user: user._id,
    };
    try {
      const res = await fetch(`${backendURL}cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setAddToCartStatus("Added to cart successfully!");
      } else {
        const errorData = await res.json();
        setAddToCartStatus(`Failed to add to cart: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      setAddToCartStatus("Network error while adding to cart");
    }
  };

  if (!product) return <p className="loading-text">Loading product...</p>;

  return (
    <div className="product-detail-container">
    
      <div className="media-section">
        <div className="main-image-wrapper">
          <img
            src={product.image ? `${backendURL}${product.image}` : ""}
            alt={product.name}
            className="main-image"
          />
        </div>
        <div className="thumbnail-row">
          <img
            src={product.image ? `${backendURL}${product.image}` : ""}
            alt="thumbnail"
            className="thumbnail-image"
          />
        </div>
      </div>

  
      <div className="info-section">
        <div>
          <h1 className="product-name">{product.name}</h1>
          {product.owner && (
            <div className="owner-info">
              Uploaded by: <span className="owner-name">{product.owner.name}</span>
              {product.owner.official_email && (
                <span>
                  {" "}
                  | Contact:{" "}
                  <a href={`mailto:${product.owner.official_email}`} className="owner-email-link">
                    {product.owner.official_email}
                  </a>
                </span>
              )}
            </div>
          )}
          <pre className="product-description">{product.description}</pre>
          <div className="rating-row">
            <span className="stars">⭐⭐⭐⭐☆</span>{" "}
            <span className="rating-count">(429 Ratings)</span>
          </div>
          <p className="category-text">
            Category: <span className="category-name">{product.category}</span>
          </p>
          <div className="price-row">
            <span className="price">Rs. {product.price}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">Rs. {product.originalPrice}</span>
                {product.discountPercent && (
                  <span className="discount-badge">-{product.discountPercent}%</span>
                )}
              </>
            )}
          </div>
          <div className="quantity-row">
            {user?.role === "user" && (
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product.quantityAvailable
                        ? Math.min(product.quantityAvailable, q + 1)
                        : q + 1
                    )
                  }
                  disabled={product.quantityAvailable !== undefined && quantity >= product.quantityAvailable}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            )}
            <div className="max-quantity-text">
              ({product.quantityAvailable ?? "N/A"} Max)
            </div>
          </div>

          <div className="action-buttons-row">
            {user?.role === "seller" ? (
              <div className="admin-buttons">
                <button className="edit-btn" onClick={() => handleEdit(product)}>
                  Edit Content
                </button>
                <button className="delete-btn" onClick={() => setShowDeletePopUp(true)}>
                  Delete Content
                </button>
              </div>
            ) : (
              <div className="user-buttons">
                <button className="buy-now-btn">Buy Now</button>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            )}
          </div>

          {addToCartStatus && <p className="add-to-cart-status">{addToCartStatus}</p>}
        </div>

        {product && user && (
          <div className="review-section">
            <ProductReview productId={product._id} currentUser={user.name} />
          </div>
        )}

        {showDeletePopUp && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p className="popup-message">Are you sure you want to delete this product?</p>
              <div className="popup-buttons">
                <button onClick={() => handleDelete(product)} className="popup-confirm-btn">
                  Yes, Delete
                </button>
                <button onClick={() => setShowDeletePopUp(false)} className="popup-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
