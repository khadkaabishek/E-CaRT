import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { isSameMonth, parseISO } from "date-fns";

type DailySalesData = {
  productName: string;
  totalSold: number;
  salesByDay: { date: string; quantity: number }[];
  productId: string;
};

type Props = {
  data: DailySalesData[];
  month?: Date; // Optional, defaults to current month
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28fd0", "#4dc9ff"];

const SalesPieChartMonthly: React.FC<Props> = ({ data, month = new Date() }) => {
  const aggregatedData = data.map((product) => {
    const total = product.salesByDay.reduce((sum, sale) => {
      const saleDate = parseISO(sale.date);
      return isSameMonth(saleDate, month) ? sum + sale.quantity : sum;
    }, 0);

    return {
      name: product.productName,
      value: total,
    };
  }).filter(p => p.value > 0); // only show products with actual sales

  if (!aggregatedData.length) {
    return <div className="no-data-message">No sales data for this month.</div>;
  }

  return (
    <div className="pie-chart-wrapper">
      <h3 className="text-xl font-semibold mb-2">Top Selling Products (This Month)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {aggregatedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPieChartMonthly;
