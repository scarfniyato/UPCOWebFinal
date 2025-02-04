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

      {/* Dropdown Filters */}
      <div className="flex gap-2 text-[#333333] justify-end">
        <select
          id="monthYearSelect"
          className="border border-gray-300 rounded-md text-xs px-2 py-1 focus:ring focus:ring-green-300"
          value={`${month} ${year}`}  // Combining month and year as the value
          onChange={(e) => {
            const [selectedMonth, selectedYear] = e.target.value.split(' ');  // Split to get month and year
            setMonth(selectedMonth);  // Set the month
            setYear(selectedYear);    // Set the year
          }}
        >
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            .map((m) => (
              availableYears.map((availableYear) => (
                <option key={`${m} ${availableYear}`} value={`${m} ${availableYear}`}>
                  {m} {availableYear}
                </option>
              ))
            ))}
        </select>
      </div>

      {/*Title*/}
      <h2 className="text-sm font-semibold text-gray-700 m-2">Top 10 Solid Waste Generators</h2>

      {/* Table Section */}
      <div className="w-full flex-1 text-black overflow-auto">
        <table className="w-full border-collapse ">
          <thead className="bg-gray-200">
            <tr className="text-gray-700">
              <th className="px-3 py-2 text-center text-[11px]">No.</th>
              <th className="px-3 py-2 text-center text-[11px]">College</th>
              <th className="px-3 py-2 text-center text-[11px]">Total Waste (kg)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center py-2 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-300" style={{ 
                  backgroundColor: colorScale(item.totalKg || 0)}}>
                  <td className="px-3 py-2 text-xs font-bold rounded" style={{ textShadow: "0px 0px 0px rgba(252, 141, 61, 100)" }}>{index + 1}</td>
                  <td className="px-3 py-2 bg-white text-[11px]">{item.name}</td>
                  <td className="px-3 py-2 bg-white text-xs" >{item.totalKg} kg</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2 text-gray-500">
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
