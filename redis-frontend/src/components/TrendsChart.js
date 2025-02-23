import { Chart } from "react-google-charts";
import React, { useState, useEffect } from "react";

const TrendsChart = ({ items }) => {
  const [chartData, setChartData] = useState([["Month", "Items Received", "Items Expiring"]]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const receivedCounts = {};
    const expiringCounts = {};

    items.forEach((item) => {
      const receivedMonth = new Date(item.date_received).toLocaleString("default", { month: "short", year: "numeric" });
      const expiringMonth = new Date(item.expiration_date).toLocaleString("default", { month: "short", year: "numeric" });

      receivedCounts[receivedMonth] = (receivedCounts[receivedMonth] || 0) + Number(item.quantity);
      expiringCounts[expiringMonth] = (expiringCounts[expiringMonth] || 0) + 1;
    });

    // Get all months in sorted order
    const allMonths = [...new Set([...Object.keys(receivedCounts), ...Object.keys(expiringCounts)])].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Format Data for Google Charts
    const data = [["Month", "Items Received", "Items Expiring"]];
    allMonths.forEach((month) => {
      data.push([month, receivedCounts[month] || 0, expiringCounts[month] || 0]);
    });

    setChartData(data);
  }, [items]); // Updates when `items` change

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={chartData}
      options={{
        title: "Monthly Trends",
        curveType: "function",
        legend: { position: "bottom" },
        hAxis: { title: "Month" },
        vAxis: { title: "Number of Items" },
      }}
    />
  );
};

export default TrendsChart;
