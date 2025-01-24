// AirQualityTable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // For programmatic navigation

// Helper to map month names to numbers for ordering
const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

function AirQualityTable({ onMonthYearChange }) {
  const [years, setYears] = useState([]);
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [data, setData] = useState(null); // This will hold { id, CO, NO2, SO2 }
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Define the backend base URL
  const BACKEND_URL = 'http://localhost:3001'; // Update if different

  // Fetch available years and set the latest year and month
  useEffect(() => {
    const fetchLatestData = async () => {
      setLoadingYears(true);
      setError(null); // Clear previous errors
      try {
        // Step 1: Fetch available years
        const yearsResponse = await axios.get(`${BACKEND_URL}/available_year_air`);
        const sortedYears = yearsResponse.data.sort((a, b) => b - a); // Descending order
        setYears(sortedYears);

        if (sortedYears.length === 0) {
          setError('No available years found.');
          setLoadingYears(false);
          return;
        }

        // Step 2: Select the latest year
        const latestYear = sortedYears[0];
        setSelectedYear(latestYear);

        // Step 3: Fetch all data for the latest year to determine the latest month
        const dataResponse = await axios.get(`${BACKEND_URL}/airquality_data`, {
          params: { year: latestYear }
        });

        const dataForYear = dataResponse.data;

        if (dataForYear.length === 0) {
          setError('No data available for the latest year.');
          setSelectedMonth('');
          setData(null);
          setLoadingYears(false);
          return;
        }

        // Step 4: Determine the latest month with available data
        let latestMonth = dataForYear[0].month;
        dataForYear.forEach(item => {
          if (monthOrder[item.month] > monthOrder[latestMonth]) {
            latestMonth = item.month;
          }
        });
        setSelectedMonth(latestMonth);
      } catch (err) {
        console.error('Error fetching latest data:', err);
        setError('Failed to load available years or data.');
      } finally {
        setLoadingYears(false);
      }
    };

    fetchLatestData();
  }, [BACKEND_URL]);

  useEffect(() => {
    // Only call if the parent gave us a callback
    if (onMonthYearChange) {
      onMonthYearChange(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, onMonthYearChange]);

  // Fetch data whenever selectedYear or selectedMonth changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear || !selectedMonth) {
        setData(null);
        return;
      }

      setLoadingData(true);
      setError(null); // Clear previous errors
      try {
        const response = await axios.get(`${BACKEND_URL}/airquality_data`, {
          params: {
            year: selectedYear,
            month: selectedMonth
          }
        });

        /**
         * If you return multiple documents from your backend for the same
         * year/month, you can:
         * 1) Aggregate them as you already do for CO, NO2, SO2.
         * 2) Pick an `_id` from the first (or a specific) record to pass to update/delete.
         */
        if (response.data.length > 0) {
          // Let's pick the first record's _id
          const firstRecord = response.data[0];
          // Aggregate data if multiple entries are returned for the same month
          const aggregated = {
            id: firstRecord._id, // Grab the _id from the first record
            CO: (response.data.reduce((sum, item) => sum + (item.CO || 0), 0) / response.data.length).toFixed(2),
            NO2: (response.data.reduce((sum, item) => sum + (item.NO2 || 0), 0) / response.data.length).toFixed(2),
            SO2: (response.data.reduce((sum, item) => sum + (item.SO2 || 0), 0) / response.data.length).toFixed(2),
          };
          setData(aggregated);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error('Error fetching air quality data:', err);
        setError('Failed to load air quality data.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, BACKEND_URL]);

  // Handle year change
  const handleYearChange = async (e) => {
    const newYear = parseInt(e.target.value, 10);
    setSelectedYear(newYear);
    setSelectedMonth(''); // Reset month selection
    setData(null); // Clear existing data
    setError(null); // Clear existing errors

    // Fetch data for the new year to determine the latest month
    setLoadingYears(true);
    try {
      const dataResponse = await axios.get(`${BACKEND_URL}/airquality_data`, {
        params: { year: newYear }
      });

      const dataForYear = dataResponse.data;

      if (dataForYear.length === 0) {
        setError('No data available for the selected year.');
        setSelectedMonth('');
        setData(null);
        setLoadingYears(false);
        return;
      }

      // Determine the latest month with available data
      let latestMonth = dataForYear[0].month;
      dataForYear.forEach(item => {
        if (monthOrder[item.month] > monthOrder[latestMonth]) {
          latestMonth = item.month;
        }
      });
      setSelectedMonth(latestMonth);
    } catch (err) {
      console.error('Error fetching data for the selected year:', err);
      setError('Failed to load data for the selected year.');
    } finally {
      setLoadingYears(false);
    }
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Handle Delete Action
  const handleDelete = async (id) => {
    if (!id) {
      alert('No ID found. Cannot delete data without an ID.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete this waste entry?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/delete_air/${id}`);
        alert("Waste entry deleted successfully.");

        // Since you’re deleting a record, you might want to refetch data or clear local data
        setData(null);

      } catch (error) {
        console.error("Error deleting waste data:", error);
        alert("Failed to delete the entry. Please try again.");
      }
    }
  };

  // Handle Update Action
  const handleUpdate = (id) => {
    if (!id) {
      alert('No ID found. Cannot update data without an ID.');
      return;
    }
    // Navigate to the update page with the ID
    navigate(`/update/air/${id}`);
  };

  return (
    <div className="container text-center">
      {error && <p className="text-danger">{error}</p>}

      {loadingYears ? (
        <p>Loading latest year and month...</p>
      ) : (
        <>
          {/* Dropdowns for Year and Month */}
          <div className="dropdowns my-4 text-left" data-html2canvas-ignore="true">
            <div className="dropdown-row d-flex flex-wrap gap-3">
              {/* Year Dropdown */}
              <div className="dropdown d-flex align-items-center gap-2">
                <label htmlFor="year" className="mb-1">Year:</label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  disabled={loadingYears || loadingData}
                  className="form-select"
                  style={{ marginRight: '20px', padding: '4px' }}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Dropdown */}
              <div className="dropdown d-flex align-items-center gap-2">
                <label htmlFor="month" className="mb-1">Month:</label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  disabled={loadingData || !selectedYear}
                  className="form-select"
                  style={{ marginRight: '20px', padding: '4px' }}
                >
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-responsive mt-4">
            {loadingData ? (
              <p>Loading data...</p>
            ) : data ? (
              <table className="table table-bordered table-striped">
                <thead className="columnName">
                  <tr>
                    <th className="text-center">Parameter</th>
                    <th className="text-center">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">CO</td>
                    <td className="text-center">{data.CO}</td>
                  </tr>
                  <tr>
                    <td className="text-center">NO₂</td>
                    <td className="text-center">{data.NO2}</td>
                  </tr>
                  <tr>
                    <td className="text-center">SO₂</td>
                    <td className="text-center">{data.SO2}</td>
                  </tr>

                  {/* Actions Row */}
                  <tr data-html2canvas-ignore="true">
                    <td className="text-center "><strong>Actions</strong></td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button
                          className="update-btn"
                          onClick={() => handleUpdate(data.id)}
                        >
                          Update
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(data.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No data available for the selected year and month.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
// Basic inline styles for simplicity
const styles = {
  container: {
    color: '#333333',
    margin: 0,
  },
  dropdownContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column'
  },
  select: {
    padding: '8px',
    fontSize: '16px'
  },
  tableContainer: {
    marginTop: '20px'
  },
  table: {
    width: '50%',
    borderCollapse: 'collapse'
  },
  th: {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    color: '#333333'
  },
  td: {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
    color: '#333333'
  },
  stripedRow: {
    backgroundColor: '#f2f2f2'
  },
  error: {
    color: 'red'
  }
};

export default AirQualityTable;
