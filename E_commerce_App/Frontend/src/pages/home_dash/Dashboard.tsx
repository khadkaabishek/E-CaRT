import React, { useEffect, useState,useCallback } from "react";
import { useLocation } from "react-router-dom";
import GroupedItemCard from "../../components/GroupedItemCard";
import PriceFilter from "../../components/PriceFilter";
import Draggable from "react-draggable";
import "./../../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  const token = localStorage.getItem("token");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search")?.toLowerCase() ?? "";

  useEffect(() => {
    const getCardData = async () => {
      setError(null);
      try {
        const response = await fetch("http://localhost:5001/api/get_item", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching item:", err);
        setError(err.message || "Something went wrong");
      }
    };

    getCardData();
  }, [token]);

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(search);
    const priceMatch =
      product.price >= priceRange.min && product.price <= priceRange.max;
    return nameMatch && priceMatch;
  });

  const groupedProducts: Record<string, typeof products> = filteredProducts.reduce(
    (acc, product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    },
    {}
  );

  Object.keys(groupedProducts).forEach((category) => {
    groupedProducts[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  const sortedGroupedProducts = Object.fromEntries(
    Object.entries(groupedProducts).sort(([a], [b]) => a.localeCompare(b))
  );

  const handlePriceChange = useCallback((min: number, max: number) => {
    setPriceRange({ min, max });
  },[]);

  return (
    <div className="dashboard-page">
     <Draggable handle=".drag-handle">
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 30,
            zIndex: 999,
            cursor: "move",
          }}
        >
          <div className="drag-handle">
            <PriceFilter
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              onPriceChange={handlePriceChange}
            />
          </div>
        </div>
      </Draggable>

      <div className=" dashboard-container">
        {error && <p className="error-message">{error}</p>}
        <GroupedItemCard groupedData={sortedGroupedProducts} />
      </div>
    </div>
  );
};

export default Dashboard;
