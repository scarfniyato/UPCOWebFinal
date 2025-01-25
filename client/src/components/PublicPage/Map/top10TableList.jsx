import React, { useState, useEffect } from 'react';
import './style.css';

const Top10TableList = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const colorCoding = [
    '#FFE6E6', // Softer Light Red
    '#FFE5D0', // Softer Light Orange
    '#FFF9D6', // Softer Light Yellow
    '#EBFFCC', // Softer Light Lime Green
    '#D8FFD8', // Softer Light Green
    '#CCF7E4', // Softer Mint Green
    '#D6EAD6', // Softer Light Forest Green
    '#CCE8D8', // Softer Soft Teal Green
    '#D6F0F0', // Softer Light Teal
    '#CFE8E8', // Softer Light Grayish Teal
  ]

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
      console.error('Error fetching top 10 data:', error);
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
        setYear(years[0] || new Date().getFullYear());
      }
    } catch (error) {
      console.error('Error fetching available years:', error);
    }
  };

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    fetchTop10Data();
  }, [month, year]);

  return (
    <div className="top10-table-list">
      <div className="filter-section row mb-4">
        <div className="filter-controls" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap:' 10px' }}>
          <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center'}}>
            <label htmlFor="monthSelect" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Select Month: </label>
            <select
              id="monthSelect"
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{textAlign: 'center', textAlignLast: 'center', width: '150px' }}
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
              ].map((m) => (
                <option key={m} value={m} style={{ textAlign: 'center' }}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="yearSelect" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Select Year:</label>
            <select
              id="yearSelect"
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ textAlign: 'center', textAlignLast: 'center', width: '150px' }}
            >
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear} style={{ textAlign: 'center' }}>
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
            <th style={{ textAlign: 'center' }}>No.</th>
            <th style={{ textAlign: 'center' }}>College</th>
            <th style={{ textAlign: 'center' }}>Total Solid Waste Generated (kg)</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} style={{ backgroundColor: colorCoding[index] }}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ textAlign: 'center' }}>{item.name}</td>
                <td style={{ textAlign: 'center' }}>{item.totalKg} kg</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
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

