import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./../styles/productReview.css";

interface Review {
  _id: string;
  user: string | { name?: string };
  comment: string;
  createdAt: string;
}

interface ProductReviewProps {
  currentUser: string;
}

const ProductReview: React.FC<ProductReviewProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token");

  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/${id}/interaction`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await fetch(`/api/${id}/likes`);
      const data = await res.json();
      setLikeCount(data.count || 0);
    } catch {
      setLikeCount(0);
    }
  };
  useEffect(() => {
    fetchReviews();
    fetchLikes();
    fetchLikeStatus();
  
    const interval = setInterval(fetchReviews, 1000); 
    return () => clearInterval(interval);
  }, [id]);
  
  const fetchLikeStatus = async () => {
    if (!token || !id) return;
    try {
      const res = await fetch(`/api/${id}/likes/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIsLikedByUser(data.liked);
    } catch (err) {
      setIsLikedByUser(false);
    }
  };

  const handleProductLikeToggle = async () => {
    if (!token || !id) return;

    try {
      const response = await fetch(`/api/${id}/likes/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsLikedByUser((prev) => !prev);
        fetchLikes();
      }
    } catch {
      console.error("Failed to toggle like");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !token || !id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/${id}/interaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (res.ok) {
        setComment("");
        fetchReviews();
      }
    } catch {
      console.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchLikes();
    fetchLikeStatus();
  }, [id]);

  return (
    <section className="review-container">
      <h2 className="review-title">Customer Reviews</h2>

      <div className="like-product-section">
        <button
          onClick={handleProductLikeToggle}
          className={`like-button ${isLikedByUser ? "liked" : ""}`}
        >
          {isLikedByUser ? (
            <FaHeart className="heart-icon" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
          <span>{likeCount} Likes</span>
        </button>
      </div>

      <div className="comment-input-wrapper">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="comment-textarea"
        />
        <button
          onClick={handleCommentSubmit}
          disabled={loading}
          className={`comment-submit-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="no-reviews-text">No reviews yet.</p>
      ) : (
        <ul className="reviews-list">
          {reviews.map((rev) => (
            <li key={rev._id} className="review-item">
              <header className="review-header">
                <h3 className="review-user">
                  {typeof rev.user === "string"
                    ? rev.user
                    : rev.user?.name || "Anonymous"}
                </h3>
                <time dateTime={rev.createdAt} className="review-date">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </time>
              </header>
              <p className="review-comment">{rev.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProductReview;
