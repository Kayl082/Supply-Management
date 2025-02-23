import React, { useState, useEffect } from "react";
import Card from "../components/Card"; // Ensure the path is correct
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling
import "../content/dataVisualization.css";

const InventorySummary = ({ items }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [itemsExpiringSoon, setItemsExpiringSoon] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [openTable, setOpenTable] = useState(null);
  const [groupBy, setGroupBy] = useState("category"); // Default grouping

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Calculate Total Items (Ensure quantity is a number)
    const total = items.reduce((acc, item) => acc + Number(item.quantity), 0);
    setTotalItems(total);

    // Get Items Expiring Soon (Within 1 month)
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const expiringSoon = items.filter((item) => {
      const expirationDate = new Date(item.expiration_date);
      return expirationDate < nextMonth;
    });
    setItemsExpiringSoon(expiringSoon);

    // Get Low Stock Items (Threshold: 10) 
    const lowStock = items.filter((item) => Number(item.quantity) < 10);
    setLowStockItems(lowStock);
  }, [items]);

  // Grouped Totals Based on Dropdown Selection
  const getGroupedItems = () => {
    const grouped = items.reduce((acc, item) => {
      const key = item[groupBy]; // Dynamic key based on dropdown
      acc[key] = (acc[key] || 0) + Number(item.quantity);
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, total]) => ({ key, total }));
  };

  return (
    <div className="container">
      <div className="row" id="cssgrid">
        {/* Total Items */}
        <div className="col-md-4">
          <Card className="h-100">
            <h2 className="text-lg font-bold csscardtitle">Total Items</h2>
            <p className="text-xl">{totalItems}</p>
            <p
              className="text-xl text-primary cursor-pointer cssviewmore"
              onClick={() => setOpenTable(openTable === "total" ? null : "total")}
            >
              More...
            </p>
          </Card>
        </div>

        {/* Items Expiring Soon */}
        <div className="col-md-4">
          <Card className="h-100">
            <h2 className="text-lg font-bold csscardtitle">Items Expiring Soon</h2>
            <p className="text-xl">{itemsExpiringSoon.length}</p>
            <p
              className="text-xl text-primary cursor-pointer cssviewmore"
              onClick={() => setOpenTable(openTable === "expiring" ? null : "expiring")}
            >
              More...
            </p>
          </Card>
        </div>

        {/* Low Stock Items */}
        <div className="col-md-4">
          <Card className="h-100">
            <h2 className="text-lg font-bold csscardtitle">Low Stock Items</h2>
            <p className="text-xl">{lowStockItems.length}</p>
            <p
              className="text-xl text-primary cursor-pointer cssviewmore"
              onClick={() => setOpenTable(openTable === "lowStock" ? null : "lowStock")}
            >
              More...
            </p>
          </Card>
        </div>
      </div>

      {/* Total Items Table with Dropdown */}
      {openTable === "total" && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Total Items Based on: </h5>
            <button type="button" className="btn-close" onClick={() => setOpenTable(null)}></button>
          </div>
          <select
            className="form-select mb-3"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="item_code">Item Code</option>
            <option value="category">Category</option>
            <option value="date_received">Date Received</option>
            <option value="expiration_date">Expiration Date</option>
            <option value="supplier">Supplier</option>
          </select>
          <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #ddd" }}>
          <table className="table table-bordered">
            <thead className="tableheader">
              <tr>
                <th>{groupBy.replace("_", " ").toUpperCase()}</th>
                <th>Total Quantity</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              {getGroupedItems().map((item, index) => (
                <tr key={index}>
                  <td>{item.key}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Expiring Soon Table */}
      {openTable === "expiring" && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Items Expiring Soon</h5>
            <button type="button" className="btn-close" onClick={() => setOpenTable(null)}></button>
          </div>
          <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #ddd" }}>
          <table className="table table-bordered">
            <thead className="tableheader">
              <tr>
                <th>Item Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Expiration Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              {itemsExpiringSoon.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.expiration_date}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Low Stock Items Table */}
      {openTable === "lowStock" && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Low Stock Items</h5>
            <button type="button" className="btn-close" onClick={() => setOpenTable(null)}></button>
          </div>
          <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #ddd" }}>
          <table className="table table-bordered">
            <thead className="tableheader">
              <tr>
                <th>Item Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              {lowStockItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySummary;
