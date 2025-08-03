import React, { useEffect, useState } from "react";
import Bill from "../components/Bill";
import "./../styles/myOrders.css";

interface OwnerType {
  name: string;
  email: string;
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  image?: string;
  owner?: OwnerType;
}

interface OrderItem {
  product: ProductType;
  quantity: number;
}

interface OrderType {
  _id: string;
  contact: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  status: string;
  items: OrderItem[];
  createdAt: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/checkout/my-orders/${user._id}`,
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
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      setError("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error">{error}</div>;
  const confirmDone = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:5001/checkout/confirm-done/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order marked as Done");
        fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="my-orders-page-container">
      <div className="orders-list">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p className="empty-msg">You have not placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              {/* Header */}
              <div className="order-header">
                <h3>Order ID: {order._id}</h3>
                <span>Status: {order.status}</span>
              </div>

              {/* Contact */}
              <div className="order-details">
                <p>
                  <strong>Address:</strong> {order.contact.address},{" "}
                  {order.contact.city}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Items summary */}
              <div className="order-items-summary">
                {order.items && order.items.length > 0 ? (
                  <p>
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>

              {/* Button to show bill */}
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
              {order.status === "Delivered" && (
  <button
    className="confirm-btn"
    onClick={() => confirmDone(order._id)}
  >
    Confirm Done
  </button>
)}
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
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
