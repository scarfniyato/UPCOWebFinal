import React, { useEffect, useState } from "react"; 
import axios from "axios";
import "../style.css";

function TotalWaste() {
  const [totalWaste, setTotalWaste] = useState(0);
  const [error, setError] = useState("");
  const [latestYear, setLatestYear] = useState("");
  const [latestMonth, setLatestMonth] = useState("");

  // Define months as a constant array in ascending order
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 1. Fetch the latest available year
  useEffect(() => {
    const fetchLatestYear = async () => {
      try {
        const response = await axios.get("http://localhost:3001/available_year_waste");
        // Get the latest year (maximum year)
        const sortedYears = response.data.sort((a, b) => b - a);
        setLatestYear(sortedYears[0]);
      } catch (err) {
        console.error("Error fetching available years:", err);
        setError("Failed to fetch available years.");
      }
    };

    fetchLatestYear();
  }, []);

  // 2. Fetch the latest available month for the latest year
  useEffect(() => {
    const fetchLatestMonthData = async () => {
      if (!latestYear) return; // Exit if no year is selected

      try {
        const response = await axios.get(`http://localhost:3001/filterUsers?year=${latestYear}`);
        const data = response.data;

        if (data.length > 0) {
          // Sort data to find the latest month in the latest year
          const sortedData = data.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
          const latestMonthData = sortedData[sortedData.length - 1]; // Get data for the latest month

          // Get the latest month
          setLatestMonth(latestMonthData.month);

          // Calculate total waste for the latest month
          const residual = parseFloat(latestMonthData.residual) || 0;
          const biodegradable = parseFloat(latestMonthData.biodegradable) || 0;
          const recyclable = parseFloat(latestMonthData.recyclable) || 0;
          const totalWaste = (residual + biodegradable + recyclable).toFixed(1);

          setTotalWaste(totalWaste); // Set the total waste to state
        }
      } catch (err) {
        console.error("Error fetching waste data:", err);
        setTotalWaste(0); // If there's an error, set total waste to 0
        setError("Failed to fetch waste data. Please try again later.");
      }
    };

    fetchLatestMonthData();
  }, [latestYear]);

  return (
    <div style={{ color: '#333333' }}>
      {/* Display error if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className='fbold text-5xl'>{totalWaste} kg</div>
      <div className='fnormal text-xs'><br/>Total Solid Waste Generated This Month</div>
    </div>
  );
}

export default TotalWaste;
