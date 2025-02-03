import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

function WasteQualityChart({ onYearChange }) {
  const [allData, setAllData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios.get('http://localhost:3001/filterUsers')
      .then(result => {
        const data = result.data;
        setAllData(data);
        const years = Array.from(new Set(data.map(item => item.year))).sort((a, b) => a - b);
        setAvailableYears(years);
        const latestYear = years.length > 0 ? years[years.length - 1] : '';
        setSelectedYear(latestYear);
        setChartData(formatChartData(data, latestYear));
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const filteredData = allData.filter(item => item.year === Number(selectedYear));
      setChartData(formatChartData(filteredData, selectedYear));
    }
  }, [selectedYear, allData]);

  useEffect(() => {
    if (onYearChange) {
      onYearChange(selectedYear);
    }
  }, [selectedYear, onYearChange]);

  const formatChartData = (data, year) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const datasets = [
      {
        label: 'Residuals',
        data: [],
        borderColor: '#ffbb2a',
        backgroundColor: 'rgba(255, 239, 205, 0.5)',
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#FF9F1A',
      },
      {
        label: 'Biodegradables',
        data: [],
        borderColor: '#2489e1',
        backgroundColor: 'rgba(23, 131, 230, 0.5)',
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#2489e1',
      },
      {
        label: 'Recyclables',
        data: [],
        borderColor: '#4d8833',
        backgroundColor: 'rgba(87, 141, 60, 0.3)',
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#4d8833',
      }
    ];

    months.forEach(month => {
      const monthData = data.filter(item => item.month === month);
      datasets[0].data.push(monthData.reduce((acc, cur) => acc + (cur.residual || 0), 0));
      datasets[1].data.push(monthData.reduce((acc, cur) => acc + (cur.biodegradable || 0), 0));
      datasets[2].data.push(monthData.reduce((acc, cur) => acc + (cur.recyclable || 0), 0));
    });

    return { labels: months, datasets };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        position: 'average',
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Solid Waste Generated Chart',
        font: {
          size: 15,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-3 text-[#333333] p-4">
      {/*Title & Year Selection*/}
      <div className="w-full flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">
          Solid Waste Generated in CvSU - Main Campus
        </h2>
        {availableYears.length > 0 && (
          <select
            id="yearSelect"
            className="border border-gray-300 rounded-md text-sm px-3 py-1 focus:ring focus:ring-green-300"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chart Container*/}
      <div className="w-full h-[350px]">
        <Line data={chartData} options={options} />
      </div>

      {/*Legend*/}
      <div className="flex justify-center gap-4 mt-2">
        {chartData.datasets.map(dataset => (
          <div key={dataset.label} className="flex items-center gap-2">
            <span
              className="w-5 h-5 inline-block rounded-full"
              style={{ backgroundColor: dataset.borderColor }}
            ></span>
            <span className="text-sm text-gray-600">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WasteQualityChart;
