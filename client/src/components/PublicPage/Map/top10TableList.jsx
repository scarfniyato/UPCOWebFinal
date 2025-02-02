import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const Top10TableList = ({ className = "", style = {} }) => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableYears();
    fetchLatestWasteData();
  }, []);

  useEffect(() => {
    fetchTop10Data();
  }, [month, year]);

  const fetchLatestWasteData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/latest-waste-data");
      if (!response.ok) throw new Error("Failed to fetch latest waste data.");
      const { month: latestMonth, year: latestYear } = await response.json();
      setMonth(latestMonth);
      setYear(latestYear);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTop10Data = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/top10-waste-generators?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch top 10 data.");
      const top10Data = await response.json();
      setData(top10Data.length ? top10Data : []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/waste-data-years");
      if (!response.ok) throw new Error("Failed to fetch available years.");
      const years = await response.json();
      setAvailableYears(years);
    } catch (error) {
      console.error(error);
    }
  };


  const colorScale = d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([Math.min(...data.map((d) => d.totalKg || 0)), Math.max(...data.map((d) => d.totalKg || 1))]);

  return (
    <div className={`w-full h-full flex flex-col p-3 ${className}`} style={style}>
      
      {/*Title & Filters Section */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-sm font-semibold text-gray-700">Top 10 Solid Waste Generators</h2>

        {/*Dropdown Filters */}
        <div className="flex gap-2 text-[#333333]">
          <select
            id="monthSelect"
            className="border border-gray-300 rounded-md text-xs px-2 py-1 focus:ring focus:ring-green-300"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
              .map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>

          <select
            id="yearSelect"
            className="border border-gray-300 rounded-md text-xs px-2 py-1 focus:ring focus:ring-green-300"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {availableYears.map((availableYear) => (
              <option key={availableYear} value={availableYear}>
                {availableYear}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full flex-1 text-black overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-200">
            <tr className="text-gray-700 text-xs">
              <th className="px-3 py-2 text-center">No.</th>
              <th className="px-3 py-2 text-center">College</th>
              <th className="px-3 py-2 text-center">Total Waste (kg)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center py-2 text-gray-500 text-xs">
                  Loading...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-300" style={{ backgroundColor: colorScale(item.totalKg || 0) }}>
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.totalKg} kg</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2 text-gray-500 text-xs">
                  No data available for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Top10TableList;
