import React, { useEffect, useState } from "react";
import GroupedItemCard from "../components/GroupedItemCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image?: string;
  category?: string;
}

const MyItems: React.FC = () => {
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});
  const [error, setError] = useState<string | null>(null);
  const token: string | null = localStorage.getItem("token");
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;

  useEffect(() => {
    const getCardData = async () => {
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5001/api/${user._id}/get-my-items`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await response.json();

        // ✅ Group products by category
        const grouped = data.reduce((acc: Record<string, Product[]>, product) => {
          const category = product.category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
      } catch (err: any) {
        console.error("Error fetching item:", err);
        setError(err.message || "Something went wrong");
      }
    };

    getCardData();
  }, []);

  return (
    <>
      <h1>My Products</h1>
      {error && <p className="error-message">{error}</p>}
      <GroupedItemCard groupedData={groupedProducts} />
    </>
  );
};

export default MyItems;
