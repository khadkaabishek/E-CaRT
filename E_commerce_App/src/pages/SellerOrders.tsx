import React, { useEffect, useState } from "react";
import Bill from "../components/Bill"; // Reuse the same Bill component
import "./../styles/sellerOrders.css";

interface BuyerType {
  name: string;
  email: string;
}

interface ProductOwner {
  name: string;
  email: string;
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  image?: string;
  owner?: ProductOwner;
}

interface SellerOrderItem {
  product: ProductType;
  quantity: number;
}

interface SellerOrder {
  _id: string;
  buyer: BuyerType;
  contact: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  status: string;
  items: SellerOrderItem[];
  createdAt: string;
}

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/checkout/seller-orders/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch seller orders");
      }
    } catch (err) {
      setError("Something went wrong while fetching seller orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5001/checkout/update-status/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(`Order marked as ${newStatus}`);
        fetchSellerOrders(); // Refresh
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="seller-orders-page-container">
      <div className="orders-list">
        <h2>Orders for Your Products</h2>
        {orders.length === 0 ? (
          <p className="empty-msg">No orders found for your products.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <h3>Order ID: {order._id}</h3>
                <span>Status: {order.status}</span>
              </div>

              <div className="order-details">
                <p>
                  <strong>Buyer:</strong> {order.contact.name} 
                </p>
                <p>
                  <strong>Ship To:</strong> {order.contact.address}, {order.contact.city}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="order-items-summary">
                {order.items && order.items.length > 0 ? (
                  <p>
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    selectedOrder && selectedOrder._id === order._id
                      ? null
                      : order
                  )
                }
                className="show-bill-btn"
              >
                {selectedOrder && selectedOrder._id === order._id
                  ? "Hide Bill"
                  : "Show Bill"}
              </button>
              <div className="order-actions">
  {order.status === "Pending" && (
    <button
      onClick={() => updateStatus(order._id, "Dispatched")}
      className="btn-dispatch"
    >
      Mark as Dispatched
    </button>
  )}

  {order.status === "Dispatched" && (
    <button
      onClick={() => updateStatus(order._id, "Delivered")}
      className="btn-deliver"
    >
      Mark as Delivered
    </button>
  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill side panel */}
      <div className={`bill-panel ${selectedOrder ? "open" : ""}`}>
        {selectedOrder && (
          <>
            <button
              className="close-bill-btn"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            <Bill
              orderId={selectedOrder._id}
              contact={selectedOrder.contact}
              status={selectedOrder.status}
              items={selectedOrder.items}
              createdAt={selectedOrder.createdAt}
              buyer={selectedOrder.buyer}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
