import { Chart } from "react-google-charts";
import React, { useState, useEffect } from "react";

const SupplierChart = ({ items }) => {
  const [chartData, setChartData] = useState([["Supplier", "Quantity"]]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Calculate Supplier Contribution
    const supplierCounts = items.reduce((acc, item) => {
      acc[item.supplier] = (acc[item.supplier] || 0) + Number(item.quantity);
      return acc;
    }, {});

    // Convert to Chart Format
    const data = [["Supplier", "Quantity"], ...Object.entries(supplierCounts)];
    setChartData(data);
  }, [items]); // Runs whenever `items` change

  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="300px"
      data={chartData}
      options={{
        title: "Item Distribution Based on Supplier",
        hAxis: { title: "Quantity", minValue: 0 },
        vAxis: { title: "Supplier" },
        legend: { position: "none" },
      }}
    />
  );
};

export default SupplierChart;
