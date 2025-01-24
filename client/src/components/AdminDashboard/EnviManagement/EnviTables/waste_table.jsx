import React, { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import "../style.css"

function WasteTable() {
  // State variables
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");

  // New state for fetching available years
  const [availableYears, setAvailableYears] = useState([]);
  const [yearError, setYearError] = useState("");
  const [loadingYears, setLoadingYears] = useState(false);

  // Define months as a constant array in ascending order
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 1. Fetch available years for the year dropdown in ascending order
  useEffect(() => {
    const fetchAvailableYears = async () => {
      setLoadingYears(true);
      setYearError("");
      try {
        const response = await axios.get("http://localhost:3001/available_year_waste");
        // Sort the array in ascending order (oldest -> newest).
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

  // 2. Fetch filtered users based on selectedMonth & selectedYear
  //    If both are empty, fetch ALL data from the server.
  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedMonth) queryParams.append("month", selectedMonth);
        if (selectedYear) queryParams.append("year", Number(selectedYear));

        const response = await axios.get(`http://localhost:3001/filterUsers?${queryParams.toString()}`);
        let data = response.data;

        /**
         * Sort the data by:
         * 1) Year ascending (oldest to newest)
         * 2) Month ascending (January -> December within each year)
         */
        data.sort((a, b) => {
          // First compare by year ascending
          if (a.year !== b.year) {
            return a.year - b.year;
          }
          // If same year, compare by month index ascending
          return months.indexOf(a.month) - months.indexOf(b.month);
        });

        setFilteredUsers(data);
        setError(""); // clear previous errors
      } catch (err) {
        console.error("Error fetching filtered users:", err);
        setFilteredUsers([]);
        setError("Failed to fetch waste data. Please try again later.");
      }
    };
    fetchFilteredUsers();
  }, [selectedMonth, selectedYear]);

  // Handle Delete Action per Entry
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this waste entry?`)) {
      try {
        await axios.delete(`http://localhost:3001/delete_solidwaste/${id}`);
        // Remove the deleted record from state
        setFilteredUsers((prevData) => prevData.filter((item) => item._id !== id));
        alert("Waste entry deleted successfully.");
      } catch (error) {
        console.error("Error deleting waste data:", error);
        alert("Failed to delete the entry. Please try again.");
      }
    }
  };

  // Function to calculate total waste
  const calculateTotal = (item) => {
    const residual = parseFloat(item.residual) || 0;
    const biodegradable = parseFloat(item.biodegradable) || 0;
    const recyclable = parseFloat(item.recyclable) || 0;
    return (residual + biodegradable + recyclable).toFixed(1);
  };

  return (
    <div className=""  style={{ color: '#333333' }}>
      {yearError && <div className="alert alert-danger">{yearError}</div>}

      {loadingYears && <p>Loading available years...</p>}

      <div className="row mb-4">
        <div className="col-md-8 d-flex align-items-center fbold">
          <label htmlFor="monthSelect" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Select Month: </label>
          <select
            id="monthSelect"
            className="form-select dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ marginRight: '20px', padding: '4px' }}
          >
            <option value="">All Months</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>

          <label htmlFor="yearSelect" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Select Year:</label>
          <select
            id="yearSelect"
            className="form-select dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loadingYears}
            style={{ padding: '4px' }}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Error Message for waste data fetch */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Table: Individual Solid Waste Entries */}
      <div className="">
        <div className="">
          <div className="table-responsive">
            <table className="w-full">
              <thead className="text-left bg-dark text-white">
                <tr>
                  <th className="py-2 px-4">Year</th>
                  <th className="py-2 px-4">Month</th>
                  <th className="py-2 px-4">Residuals</th>
                  <th className="py-2 px-4">Biodegradables</th>
                  <th className="py-2 px-4">Recyclables</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-left">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr key={item._id}>
                      <td className="py-2 px-4">{item.year}</td>
                      <td className="py-2 px-4">{item.month}</td>
                      <td className="py-2 px-4">{item.residual ?? "N/A"}</td>
                      <td className="py-2 px-4">{item.biodegradable ?? "N/A"}</td>
                      <td className="py-2 px-4">{item.recyclable ?? "N/A"}</td>
                      <td className="py-2 px-4">{calculateTotal(item)}</td>
                      <td className="flex items-center justify-center">
                        <Link to={`/update/solidwaste/${item._id}`} className="update-btn">
                          Update
                        </Link>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WasteTable;
