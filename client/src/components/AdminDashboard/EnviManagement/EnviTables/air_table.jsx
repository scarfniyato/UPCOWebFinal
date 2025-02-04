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

  // Handle Update Action
  const handleUpdate = (id) => {
    if (!id) {
      alert('No ID found. Cannot update data without an ID.');
      return;
    }
    // Navigate to the update page with the ID
    navigate(`/dashboard/update/air/${id}`);
  };

  return (
<div className="container text-center" style={{ color: '#333333' }}>
      {error && <div className="alert alert-danger">{error}</div>}

      {loadingYears ? (
        <p>Loading latest year and month...</p>
      ) : (
        <>
          {/* Dropdowns for Year and Month */}
          <div className="row mb-4" data-html2canvas-ignore="true">
            <div className="col-md-8 d-flex align-items-center fbold text-xxs">
              <label htmlFor="year" className="mr-2">Select Year:</label>
              <select
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
                disabled={loadingYears || loadingData}
                className="form-select dropdown"
                style={{ padding: '4px' }}
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label htmlFor="month" className="ml-3 mr-2">Select Month:</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                disabled={loadingData || !selectedYear}
                className="form-select dropdown"
                style={{ padding: '4px' }}
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

          {/* Data Table */}
          <div className="table-responsive mt-4 text-xs">
            {loadingData ? (
              <p>Loading data...</p>
            ) : data ? (
              <table className="w-full border border-gray-400">
                <thead className="text-left bg-dark text-white border border-gray-500">
                  <tr>
                    <th className="py-2 px-4 border border-gray-500">Parameter</th>
                    <th className="py-2 px-4 border border-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody className="text-left">
                  <tr>
                    <td className="py-2 px-4 border border-gray-400">CO</td>
                    <td className="py-2 px-4 border border-gray-400">{data.CO}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-400">NO₂</td>
                    <td className="py-2 px-4 border border-gray-400">{data.NO2}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-400">SO₂</td>
                    <td className="py-2 px-4 border border-gray-400">{data.SO2}</td>
                  </tr>

                  {/* Actions Row */}
                  <tr>
                    <td className="py-2 px-4 border border-gray-400"><strong>Actions</strong></td>
                    <td className="py-2 px-4 border border-gray-400">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button
                          className="update-btn"
                          onClick={() => handleUpdate(data.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#068006', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#068006'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#068006'}
                        >
                          Update
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


export default AirQualityTable;
