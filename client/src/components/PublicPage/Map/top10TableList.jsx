import React, { useState, useEffect } from 'react';
import './style.css';

const Top10TableList = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const colorCoding = ['#FF3333', '#FF581A', '#FAD300', '#8BE600', '#66CC00', '#47D247', '#2DB82D', '#00B300', '#009999', '#437070'];

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
      <div className="filter-section">
      <div className='fbold text-sm'>Top 10 Solid Waste Generators</div>
        <div className="filter-controls">
          <label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="filter-select dropdown text-xs gap-2"
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
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="filter-select dropdown text-xs gap-2"
            >
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear}>
                  {availableYear}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchTop10Data} className="filter-button dropdown text-xs">
            Filter
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
      <table className="min-w-full bg-white border border-none border-separate border-spacing-1 w-full">
        <thead className='fbold text-xs bg-dark'>
          <tr className='text-white'>
            <th className='rounded-xl'>No.</th>
            <th className='rounded-xl'>College</th>
            <th className='rounded-xl p-2'>Total Solid Waste Generated (kg)</th>
          </tr>
        </thead>
        <tbody className='fnormal text-xs'>
          {isLoading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} style={{ backgroundColor: colorCoding[index] }} className='text-white'>
                <td className='rounded-xl px-4 py-2 text-center border-b'>{index + 1}</td>
                <td className='rounded-xl px-4 py-2 border-b'>{item.name}</td>
                <td className='rounded-xl px-4 py-2 text-center border-b'>{item.totalKg} kg</td>
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
    </div>
  );
};

export default Top10TableList;

