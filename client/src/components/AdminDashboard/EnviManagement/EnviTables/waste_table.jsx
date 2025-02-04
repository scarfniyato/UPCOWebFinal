import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style.css";

function WasteTable({ onMonthYearChange }) {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [yearError, setYearError] = useState("");
  const [loadingYears, setLoadingYears] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchAvailableYears = async () => {
      setLoadingYears(true);
      setYearError("");
      try {
        const response = await axios.get("http://localhost:3001/available_year_waste");
        const sortedYears = response.data.sort((a, b) => a - b);
        setAvailableYears(sortedYears);
      } catch (err) {
        console.error("Error fetching available years:", err);
        setYearError("Failed to fetch available years.");
      } finally {
        setLoadingYears(false);
      }
    };
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedMonth) queryParams.append("month", selectedMonth);
        if (selectedYear) queryParams.append("year", Number(selectedYear));

        const response = await axios.get(`http://localhost:3001/filterUsers?${queryParams.toString()}`);
        let data = response.data;

        data.sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year;
          }
          return months.indexOf(a.month) - months.indexOf(b.month);
        });

        setFilteredUsers(data);
        setError("");
      } catch (err) {
        console.error("Error fetching filtered users:", err);
        setFilteredUsers([]);
        setError("Failed to fetch waste data. Please try again later.");
      }
    };
    fetchFilteredUsers();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (onMonthYearChange) {
      onMonthYearChange(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, onMonthYearChange]);

  const calculateTotal = (item) => {
    const residual = parseFloat(item.residual) || 0;
    const biodegradable = parseFloat(item.biodegradable) || 0;
    const recyclable = parseFloat(item.recyclable) || 0;
    return (residual + biodegradable + recyclable).toFixed(1);
  };

  return (
    <div className="" style={{ color: '#333333' }}>
      {yearError && <div className="alert alert-danger">{yearError}</div>}
      {loadingYears && <p>Loading available years...</p>}

      <div className="row mb-4" data-html2canvas-ignore="true">
        <div className="col-md-8 d-flex align-items-center fbold text-xxs">
          <label htmlFor="monthSelect" className="mr-2">Select Month:</label>
          <select
            id="monthSelect"
            className="form-select dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>

          <label htmlFor="yearSelect" className="ml-3 mr-2">Select Year:</label>
          <select
            id="yearSelect"
            className="form-select dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loadingYears}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="text-xs">
        <div className="table-responsive">
          <table className="w-full border border-gray-400">
            <thead className="text-left bg-dark text-white border border-gray-500">
              <tr>
                <th className="py-2 px-4 border border-gray-500">Year</th>
                <th className="py-2 px-4 border border-gray-500">Month</th>
                <th className="py-2 px-4 border border-gray-500">Residuals</th>
                <th className="py-2 px-4 border border-gray-500">Biodegradables</th>
                <th className="py-2 px-4 border border-gray-500">Recyclables</th>
                <th className="py-2 px-4 border border-gray-500">Total</th>
                <th className="py-2 px-4 border border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr key={item._id} className="border border-gray-400">
                    <td className="py-2 px-4 border border-gray-400">{item.year}</td>
                    <td className="py-2 px-4 border border-gray-400">{item.month}</td>
                    <td className="py-2 px-4 border border-gray-400">{item.residual ?? "N/A"}</td>
                    <td className="py-2 px-4 border border-gray-400">{item.biodegradable ?? "N/A"}</td>
                    <td className="py-2 px-4 border border-gray-400">{item.recyclable ?? "N/A"}</td>
                    <td className="py-2 px-4 border border-gray-400">{calculateTotal(item)}</td>
                    <td className="py-2 px-4 border border-gray-400">
                      <Link to={`/dashboard/update/solidwaste/${item._id}`} className="update-btn">
                        Update
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center border border-gray-400">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WasteTable;