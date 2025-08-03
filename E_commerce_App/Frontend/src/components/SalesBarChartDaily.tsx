import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import { format } from "date-fns";
import "./../styles/chart.css"
type DailySalesData = {
  productName: string;
  totalSold: number;
  salesByDay: { date: string; quantity: number }[];
  productId: string;
};

type Props = {
  data: DailySalesData[];
};

const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Orange
];

const SalesBarChartDaily: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="no-data-message">
        No sales data available
      </div>
    );
  }

  const dateSet = new Set<string>();
  data.forEach((product) => {
    product.salesByDay.forEach((sale) => dateSet.add(sale.date));
  });
  const dates = Array.from(dateSet).sort();

  const chartData = dates.map((date) => {
    const entry: { date: string; formattedDate: string; [key: string]: number | string } = {
      date,
      formattedDate: format(new Date(date), "MMM d, yyyy"),
    };
    data.forEach((product) => {
      const sale = product.salesByDay.find((s) => s.date === date);
      entry[product.productName] = sale ? sale.quantity : 0;
    });
    return entry;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }}>
              {`${entry.name}: ${entry.value} sold`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const barSize = Math.max(30, Math.min(50, 300 / dates.length));

  return (
    <div className="sales-chart-container">
      <div className="chart-wrapper">
       
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="formattedDate"
              angle={-45}
              textAnchor="end"
              fontSize={12}
              tick={{ fill: "#4b5563" }}
            >
              <Label value="Date" offset={-60} position="insideBottom" />
            </XAxis>
            <YAxis
              allowDecimals={false}
              fontSize={12}
              tick={{ fill: "#4b5563" }}
            >
              <Label value="Quantity Sold" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            {data.map((product, index) => (
              <Bar
                key={product.productId}
                dataKey={product.productName}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                barSize={barSize}
                isAnimationActive={true}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="legend-box">
        {data.map((product, index) => (
          <div key={product.productId} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="legend-label">{product.productName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesBarChartDaily;