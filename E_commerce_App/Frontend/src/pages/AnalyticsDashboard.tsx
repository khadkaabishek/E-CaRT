import React, { useEffect, useState } from "react";
import axios from "axios";
import SalesBarChartDaily from "../components/SalesBarChartDaily";
import SalesPieChartMonthly from "../components/SalesPieChartMonthly";

type SalesData = {
  productName: string;
  totalSold: number;
  salesByMonth: {
    month: string;
    quantity: number;
  }[];
  productId: string;
};

type Props = {
  ownerId: string; // passed from parent or route
};

const AnalyticsDashboard: React.FC<Props> = ({ ownerId }) => {
  const [analytics, setAnalytics] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get<SalesData[]>(
          `http://localhost:5001/analyze/${ownerId}`
        );
        setAnalytics(response.data);
      } catch (err) {
        setError("Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [ownerId]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Sales Analytics</h2>
      <SalesBarChartDaily data={analytics} />
      <SalesPieChartMonthly data={analytics} />
    </div>
  );
};

export default AnalyticsDashboard;
