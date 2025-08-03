// SellerPageLayout.tsx
import React from "react";
import "./../styles/SellerPageLayout.css";

interface Props {
  children: React.ReactNode;
}

const SellerPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="seller-layout">
      <header className="seller-header">
        <h1>YourBrand Seller Portal</h1>
      </header>
      <main className="seller-main">{children}</main>
      <footer className="seller-footer">
        © 2025 YourBrand. All rights reserved.
      </footer>
    </div>
  );
};

export default SellerPageLayout;
