import React from "react";
import "./../styles/ItemCard.css";
import { useNavigate } from "react-router-dom";

const backendURL = "http://localhost:5001/";

interface ItemCardProps {
  prodData: {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    image?: string;
  }[];
}

type Product = ItemCardProps["prodData"][0];

interface UserType {
  name: string;
  email: string;
  role: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ prodData }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user: UserType | null = storedUser ? JSON.parse(storedUser) : null;

  const handleEdit = (product: Product) => {
    navigate(`/${product._id}/edit_item_info`, { state: { product } });
  };

  const handleViewMore = (product: Product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="card-grid">
      {prodData.map((item) => (
        <div key={item._id} className="card">
          {item.image && (
            <img
              src={`${backendURL}${item.image}`}
              alt={item.name}
              className="card-image"
            />
          )}
          <div className="card-body">
            <h3 className="card-title">{item.name}</h3>
            <div className="card-price">
              <span className="price">Rs. {item.price}</span>
              {item.originalPrice && (
                <>
                  <span className="original-price">Rs. {item.originalPrice}</span>
                  {item.discountPercent && (
                    <span className="discount">-{item.discountPercent}%</span>
                  )}
                </>
              )}
            </div>
            <div className="card-actions">
              {user?.role === "seller" ? (
                <button className="btn edit-btn" onClick={() => handleEdit(item)}>
                  Edit Info
                </button>
              ) : (
                <button className="btn buy-btn">Buy Now</button>
              )}
              <button
                onClick={() => handleViewMore(item)}
                className="btn view-btn"
              >
                View More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
