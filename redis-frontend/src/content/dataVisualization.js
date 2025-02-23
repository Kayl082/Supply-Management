import { useEffect, useState } from "react";
import axios from "axios";
import InventorySummary from "../components/InventorySummary";
import CategoryChart from "../components/CategoryChart";
import SupplierChart from "../components/SupplierChart";
import TrendsChart from "../components/TrendsChart";
import "./dataVisualization.css";


const API_URL = 'http://localhost:5000/items';

const DataVisualization = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(API_URL);
        const formattedData = response.data.map(item => ({
          ...item,
          quantity: Number(item.quantity),
        }));
        setItems(formattedData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);


  return (
    <div className="p-6">
      <InventorySummary items={items} />
      <div className="csscharts">
        <div className="csschartcontainer">
            <CategoryChart items={items} />
        </div>
        <div className="csschartcontainer">
            <SupplierChart items={items} />
        </div>
        {/*<div className="csschartcontainer">
            <TrendsChart items={items} />
        </div>*/}
      </div>
    </div>
  );
};

export default DataVisualization;
