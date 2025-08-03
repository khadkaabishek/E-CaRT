import React, { useEffect, useState } from "react";
import "./../styles/Sellers.css";
interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  sellerInfo?: {
    phone: string;
    address: string;
    nidFront: string;
    nidBack: string;
    addressProof: string;
    status: string;
    appliedAt: string;
  } | null;
}

const Sellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/admin/viewSellers")
      .then((res) => res.json())
      .then((data) => setSellers(data))
      .catch((err) => console.error("Error fetching sellers:", err));
  }, []);

  return (
    <div className="sellers-container">
      <h1>All Sellers</h1>
      <div className="seller-card-wrapper">
        {sellers.map((seller) => (
          <div className="seller-card" key={seller._id}>
            <h2>{seller.name}</h2>
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Role:</strong> {seller.role}</p>
            <p><strong>Joined:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>

            {seller.sellerInfo ? (
              <>
                <p><strong>Phone:</strong> {seller.sellerInfo.phone}</p>
                <p><strong>Address:</strong> {seller.sellerInfo.address}</p>
                <p><strong>Status:</strong> {seller.sellerInfo.status}</p>
                <div className="doc-images">
                  <div>
                    <p>NID Front:</p>
                    <img src={`http://localhost:5001/uploads/SellerData/${seller.sellerInfo.nidFront}`} alt="NID Front" />
                  </div>
                  <div>
                    <p>NID Back:</p>
                    <img src={`http://localhost:5001/uploads/SellerData/${seller.sellerInfo.nidBack}`} alt="NID Back" />
                  </div>
                  <div>
                    <p>Address Proof:</p>
                    <img src={`http://localhost:5001/uploads/SellerData/${seller.sellerInfo.addressProof}`} alt="Address Proof" />
                  </div>
                </div>
              </>
            ) : (
              <p className="no-info">No seller documents available.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sellers;