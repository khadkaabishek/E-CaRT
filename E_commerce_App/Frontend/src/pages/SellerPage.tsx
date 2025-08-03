
import React from "react";
import SellerPageLayout from "../components/SellerPageLayout";
import HeroSection from "../components/HeroSection";
import WhySellWithUs from "../components/WhySellWithUs";
import SellerBenefits from "../components/SellerBenefits";
import BecomeSellerForm from "../components/BecomeSellerForm";
import FAQSection from "../components/FAQSection";
import './../styles/Sellerpage.css';

const SellerPage: React.FC = () => {
  return (
    <SellerPageLayout>
      <div className="seller-page-wrapper">
        <div className="seller-content-wrapper">
          <div className="seller-left-pane">
            <HeroSection />
            <WhySellWithUs />
            <SellerBenefits />
            <FAQSection />
          </div>
          <div className="seller-right-pane">
            <div className="form-wrapper">
              <BecomeSellerForm />
            </div>
          </div>
        </div>
      </div>
    </SellerPageLayout>
  );
};

export default SellerPage;
