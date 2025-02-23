import { Chart } from "react-google-charts";
import React, { useState, useEffect } from "react";

const CategoryChart = ({ items }) => {
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
  }, []);

  if (!chartReady) {
    return <p>Loading chart...</p>;
  }

  // Corrected Logic: Sum total quantity per category
  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.quantity);
    return acc;
  }, {});

  // Format data for Google Charts
  const data = [["Category", "Total Quantity"], ...Object.entries(categoryCounts)];

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="300px"
      data={data}
      options={{
        title: "Item Distribution Based on Category",
        pieHole: 0.4, // Makes it a donut chart (optional)
        is3D: false,  // Set to true for a 3D effect
      }}
    />
  );
};

export default CategoryChart;
