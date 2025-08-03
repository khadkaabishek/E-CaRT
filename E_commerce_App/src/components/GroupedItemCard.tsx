import React from "react";
import ItemCard from "./../components/ItemCard";
import "./../styles/GroupedItemCard.css";

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

interface GroupedItemCardProps {
  groupedData: Record<string, Product[]>;
}

const GroupedItemCard: React.FC<GroupedItemCardProps> = ({ groupedData }) => {
  return (
    <div className="grouped-card-container">
      {Object.entries(groupedData).map(([category, products]) => (
        <div key={category} className="category-group">
          <h2 className="category-title">{category}</h2>
          <ItemCard prodData={products} />
        </div>
      ))}
    </div>
  );
};

export default GroupedItemCard;
