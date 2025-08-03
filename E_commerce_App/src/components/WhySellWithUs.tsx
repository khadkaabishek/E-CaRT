// WhySellWithUs.tsx
import React from "react";
import "./../styles/WhySellWithUs.css";

const reasons = [
  { icon: "🚀", title: "Fast Delivery", desc: "Reach customers quickly and reliably." },
  { icon: "🤝", title: "Reliable Support", desc: "We’re here to help you grow." },
  { icon: "🌍", title: "Huge Reach", desc: "Access millions of active buyers." },
];

const WhySellWithUs: React.FC = () => {
  return (
    <section className="why-sell-section">
      <h3>Why Sell With Us?</h3>
      <div className="reasons-list">
        {reasons.map((reason) => (
          <div key={reason.title} className="reason-card">
            <div className="reason-icon">{reason.icon}</div>
            <h4>{reason.title}</h4>
            <p>{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhySellWithUs;
