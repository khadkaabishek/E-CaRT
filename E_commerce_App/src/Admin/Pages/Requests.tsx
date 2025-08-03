import React, { useEffect, useState } from "react";
import "./../styles/request.css"; // 👈 Import CSS file
const URL = 'http://localhost:5001/uploads/SellerData/'
interface Seller {
  _id: string;
  email: string;
  phone: string;
  address: string;
  nidFront: string;
  nidBack: string;
  addressProof: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  updatedAt: string;
}

const SellerRequests: React.FC = () => {
  const [requests, setRequests] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5001/admin/viewRequest");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`http://localhost:5001/admin/updateRequestStatus/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      alert(updated.message);

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <div>Loading seller requests...</div>;

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const reviewedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="seller-container">
      <h2>Pending Seller Applications</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="card-container">
          {pendingRequests.map((seller) => (
            <div key={seller._id} className="card">
              <p><strong>Email:</strong> {seller.email}</p>
              <p><strong>Phone:</strong> {seller.phone}</p>
              <p><strong>Address:</strong> {seller.address}</p>
              <p><strong>Status:</strong> {seller.status}</p>

              <div className="image-group">
                <div>
                  <p className="image-label">NID Front</p>
                  <img
                    src={`${URL}${seller.nidFront}`}
                    alt="NID Front"
                    className="image-preview"
                  />
                </div>
                <div>
                  <p className="image-label">NID Back</p>
                  <img
                    src={`${URL}${seller.nidBack}`}
                    alt="NID Back"
                    className="image-preview"
                  />
                </div>
                <div>
                  <p className="image-label">Address Proof</p>
                  <img
                    src={`${URL}${seller.addressProof}`}
                    alt="Address Proof"
                    className="image-preview"
                  />
                </div>
              </div>

              <div className="button-group">
                <button onClick={() => handleStatusUpdate(seller._id, "approved")} className="btn-approve">
                  ✅ Approve
                </button>
                <button onClick={() => handleStatusUpdate(seller._id, "rejected")} className="btn-reject">
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Reviewed Applications</h2>
      {reviewedRequests.length === 0 ? (
        <p>No approved or rejected applications.</p>
      ) : (
        <div className="card-container">
          {reviewedRequests.map((seller) => (
            <div key={seller._id} className="card">
              <p><strong>Email:</strong> {seller.email}</p>
              <p><strong>Phone:</strong> {seller.phone}</p>
              <p><strong>Address:</strong> {seller.address}</p>
              <p><strong>Status:</strong> {seller.status}</p>
              <p><strong>Reviewed At:</strong> {new Date(seller.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerRequests;
