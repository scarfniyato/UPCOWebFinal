import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'chart.js';
Chart.register(annotationPlugin);

const tankNames = ["U-mall Water Tank", "Main Water Tank"];

function WaterQualityChart({ onMonthYearChange2 }) {
  const [allData, setAllData] = useState([]);
  const [selectedMonthRange, setSelectedMonthRange] = useState('January-June');
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const monthOptions = [
    { value: 'January-June', label: 'January - June' },
    { value: 'July-December', label: 'July - December' },
  ];

  const BACKEND_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/available_years`);
        const sortedYears = response.data.sort((a, b) => b - a);
        setAvailableYears(sortedYears);
        if (sortedYears.length > 0) {
          setSelectedYear(sortedYears[0]);
        }
      } catch (err) {
        console.error('Error fetching available years:', err);
        setError('Failed to load available years.');
      }
    };

    fetchAvailableYears();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BACKEND_URL}/waterquality_data`, {
          params: {
            monthRange: selectedMonthRange,
            year: selectedYear,
          }
        });
        setAllData(response.data);
      } catch (err) {
        console.error('Error fetching water quality data:', err);
        setError('Failed to load water quality data.');
        setAllData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonthRange, selectedYear]);

  useEffect(() => {
    if (onMonthYearChange2) {
      onMonthYearChange2(selectedMonthRange, selectedYear);
    }
  }, [selectedMonthRange, selectedYear, onMonthYearChange2]);

  useEffect(() => {
    const formatChartData = (data) => {
      const parameters = ["pH", "Color", "FecalColiform", "TSS", "Chloride", "Nitrate", "Phosphate"];
      const datasets = tankNames.map((tank, index) => ({
        label: tank,
        data: [],
        borderColor: index === 0 ? '#4c8732' : '#ffdd94',
        backgroundColor: index === 0 ? 'rgba(76, 135, 50, 0.8)' : 'rgba(255, 187, 41, 0.5)',
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: index === 0 ? '#4c8732' : '#ffdd94',
      }));

      const groupedData = tankNames.map(tank => data.filter(item => item.source_tank === tank));

      parameters.forEach((param) => {
        tankNames.forEach((tank, tankIndex) => {
          const tankData = groupedData[tankIndex].filter(item => item[param] != null);
          const average = tankData.length > 0
            ? tankData.reduce((acc, cur) => acc + parseFloat(cur[param]), 0) / tankData.length
            : 0;
          datasets[tankIndex].data.push(parseFloat(average.toFixed(2)));
        });
      });

      return { labels: parameters, datasets };
    };

    setChartData(formatChartData(allData));
  }, [allData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      tooltip: {
        position: 'average',
        mode: 'index',
        intersect: false,
      },
      legend: { display: false },
      title: {
        display: true,
        text: selectedMonthRange && selectedYear ? `Water Quality Comparison (${selectedMonthRange} - ${selectedYear})` : 'Water Quality Comparison',
        font: { size: 15 },
      },
      annotation: {
        annotations: {
          referenceLine: {
            type: 'line',
            yMin: 5,
            yMax: 5,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              enabled: true,
              content: 'Class A-C Limit (5 mg/L)',
              position: 'end',
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              color: '#fff',
              padding: 6,
              font: { weight: 'bold' },
              yAdjust: -10,
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Parameters' },
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
      },
      y: {
        title: { display: true, text: 'Values' },
        beginAtZero: true,
        suggestedMax: 15,
      },
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 text-[#333333] p-4">
      <div className="w-full flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">
          Water Quality in CvSU - Main Campus
        </h2>
        <div className="flex gap-2">
          {/* Month Selection */}
          <select
            id="monthRangeSelect"
            className="border border-gray-300 rounded-md text-sm px-3 py-1 focus:ring focus:ring-green-300"
            value={selectedMonthRange}
            onChange={(e) => setSelectedMonthRange(e.target.value)}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Year Selection */}
          {availableYears.length > 0 && (
            <select
              id="yearSelect"
              className="border border-gray-300 rounded-md text-sm px-3 py-1 focus:ring focus:ring-green-300"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="w-full" style={{ height: "350px" }}>
        {isLoading ? (
          <p className="text-center text-blue-500">Loading data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Bar data={chartData} options={options} className="chart" />
        )}
      </div>


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
        <div className="flex items-center gap-2">
          <span className="w-6 h-1 bg-red-600 block"></span>
          <span className="text-sm text-gray-600">Class A-C Limit (5 mg/L)</span>
        </div>
      </div>
    </div>
  );
}

export default WaterQualityChart;
