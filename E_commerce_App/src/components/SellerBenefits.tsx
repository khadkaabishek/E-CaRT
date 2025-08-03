// SellerBenefits.tsx
import React from "react";
import "./../styles/SellerBenefits.css";

const benefits = [
  "Low Commission Fees",
  "Easy-to-use Seller Tools",
  "Dedicated Account Manager",
  "Detailed Analytics Dashboard",
  "Marketing & Promotion Support",
];

const SellerBenefits: React.FC = () => {
  return (
    <section className="benefits-section">
      <h3>Seller Benefits</h3>
      <ul>
        {benefits.map((benefit) => (
          <li key={benefit} className="benefit-item">✓ {benefit}</li>
        ))}
      </ul>
    </section>
  );
};

export default SellerBenefits;
