import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WasteGenerators = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]); //for the year dropdown
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/waste-data-generated?month=${month}&year=${year}`
      );
      if (response.ok) {
        const filteredData = await response.json();
        setData(filteredData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/waste-data-years');
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
        setYear(years[0] || new Date().getFullYear()); //default to the most recent year
      }
    } catch (error) {
      console.error('Error fetching available years:', error);
    }
  };

  useEffect(() => {
    fetchAvailableYears(); //fetch available years for the dropdown
  }, []);

  useEffect(() => {
    fetchData(); //fetch data when month or year changes
  }, [month, year]);

  const handleAddNewData = () => {
    navigate('/admin-waste-generators-form'); //navigate to the Admin Input Form
  };

  return (
    <div className="waste-generators">
      <h1>Solid Waste Data</h1>
      <div className="filter-section">
        <div className="filter-controls">
          <label>
            Month:
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="filter-select"
            >
              {[
                'January','February','March','April','May','June','July','August','September','October','November','December',
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Year:
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="filter-select"
            >
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear}>
                  {availableYear}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchData} className="filter-button">
            Filter
          </button>
        </div>
        <button onClick={handleAddNewData} className="add-new-data-button">
          Add New Data
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>College Name</th>
            <th>Total Solid Waste Generated in Kg</th>
            <th>Month</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.totalKg} kg</td>
                <td>{item.month}</td>
                <td>{item.year}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No data available for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WasteGenerators;

