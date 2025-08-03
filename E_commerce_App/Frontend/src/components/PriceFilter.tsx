import React, { useState, useEffect } from "react";
import "./../styles/filterprice.css";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
}) => {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  // Automatically apply filter when values change
  useEffect(() => {
    if (min <= max) {
      onPriceChange(min, max);
    }
  }, [min, max, onPriceChange]);

  return (
    <div className="price-filter">
      <label>
        Min:
        <input
          type="number"
          value={min}
          min={0}
          onChange={(e) => setMin(Number(e.target.value))}
        />
      </label>
      <label>
        Max:
        <input
          type="number"
          value={max}
          min={0}
          onChange={(e) => setMax(Number(e.target.value))}
        />
      </label>
    </div>
  );
};

export default PriceFilter;
