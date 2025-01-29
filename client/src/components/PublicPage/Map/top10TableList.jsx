import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "./style.css";

const Top10TableList = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLatestWasteData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/latest-waste-data");
      if (response.ok) {
        const { month: latestMonth, year: latestYear } = await response.json();
        setMonth(latestMonth);
        setYear(latestYear);
      }
    } catch (error) {
      console.error("Error fetching latest waste data:", error);
    }
  };

  const fetchTop10Data = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/top10-waste-generators?month=${month}&year=${year}`
      );
      if (response.ok) {
        const top10Data = await response.json();
        setData(top10Data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching top 10 data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/waste-data-years");
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
      }
    } catch (error) {
      console.error("Error fetching available years:", error);
    }
  };

  useEffect(() => {
    fetchAvailableYears();
    fetchLatestWasteData(); // Fetch and set the latest month and year
  }, []);

  useEffect(() => {
    fetchTop10Data();
  }, [month, year]);

  // Generate the color scale dynamically using D3
  const colorScale = d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([Math.min(...data.map((d) => d.totalKg)), Math.max(...data.map((d) => d.totalKg))]);

  return (
    <div className="top10-table-list">
      <div className="filter-section row mb-4">
        <div
          className="filter-controls"
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}
        >
          <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
            <label htmlFor="monthSelect" style={{ marginRight: "10px", whiteSpace: "nowrap" }}>
              Select Month:
            </label>
            <select
              id="monthSelect"
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ textAlign: "center", textAlignLast: "center", width: "150px" }}
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="yearSelect" style={{ marginRight: "10px", whiteSpace: "nowrap" }}>
              Select Year:
            </label>
            <select
              id="yearSelect"
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ textAlign: "center", textAlignLast: "center", width: "150px" }}
            >
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear}>
                  {availableYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>College</th>
            <th style={{ textAlign: "center" }}>Total Solid Waste Generated (kg)</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} style={{ backgroundColor: colorScale(item.totalKg) }}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>{item.name}</td>
                <td style={{ textAlign: "center" }}>{item.totalKg} kg</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No data available for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Top10TableList;
