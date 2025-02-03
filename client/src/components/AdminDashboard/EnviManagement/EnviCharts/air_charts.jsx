import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const aqiCategories = {
  CO: [
    { category: 'Good', min: 0, max: 1 },
    { category: 'Satisfactory', min: 1, max: 2 },
    { category: 'Moderately Polluted', min: 2, max: 10 },
    { category: 'Poor', min: 10, max: 17 },
    { category: 'Very Poor', min: 17, max: 34 },
    { category: 'Severe', min: 34, max: Infinity }
  ],
  NO2: [
    { category: 'Good', min: 0, max: 40 },
    { category: 'Satisfactory', min: 41, max: 80 },
    { category: 'Moderately Polluted', min: 81, max: 180 },
    { category: 'Poor', min: 181, max: 280 },
    { category: 'Very Poor', min: 281, max: 400 },
    { category: 'Severe', min: 400, max: Infinity }
  ],
  SO2: [
    { category: 'Good', min: 0, max: 40 },
    { category: 'Satisfactory', min: 41, max: 80 },
    { category: 'Moderately Polluted', min: 81, max: 380 },
    { category: 'Poor', min: 381, max: 800 },
    { category: 'Very Poor', min: 801, max: 1600 },
    { category: 'Severe', min: 1600, max: Infinity }
  ]
};

const categoryColors = {
  'Good': 'rgba(92,184,92,0.6)',
  'Satisfactory': 'rgba(102,153,255,0.6)',
  'Moderately Polluted': 'rgba(255,193,7,0.6)',
  'Poor': 'rgba(255,87,34,0.6)',
  'Very Poor': 'rgba(233,30,99,0.6)',
  'Severe': 'rgba(156,39,176,0.6)',
  'Unknown': 'rgba(158,158,158,0.6)'
};

const categoryBackgroundColors = {
  'Good': 'rgba(92,184,92,0.6)',
  'Satisfactory': 'rgba(102,153,255,0.6)',
  'Moderately Polluted': 'rgba(255,193,7,0.6)',
  'Poor': 'rgba(255,87,34,0.6)',
  'Very Poor': 'rgba(233,30,99,0.6)',
  'Severe': 'rgba(156,39,176,0.6)',
  'Unknown': 'rgba(158,158,158,0.6)'
};

const getAqiCategory = (pollutant, value) => {
  const categories = aqiCategories[pollutant];
  if (!categories) return 'Unknown';

  for (let i = 0; i < categories.length; i++) {
    const { min, max, category } = categories[i];
    if (value >= min && value < max) {
      return category;
    }
  }
  return 'Unknown';
};

const monthOrder = {
  'January': 1,
  'February': 2,
  'March': 3,
  'April': 4,
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10,
  'November': 11,
  'December': 12
};

function AirQualityChart({ onMonthYearChange2 }) {
  const originalChartData = useRef({
    CO: 0,
    NO2: 0,
    SO2: 0
  });

  const [chartData, setChartData] = useState({
    labels: ['CO', 'NO₂', 'SO₂'],
    datasets: [
      {
        label: 'Air Quality',
        data: [0, 0, 0],
        borderColor: [],
        backgroundColor: [],
        borderWidth: 1
      }
    ]
  });

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [error, setError] = useState(null);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const BACKEND_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchLatestData = async () => {
      setLoadingYears(true);
      setError(null);
      try {
        const yearsResponse = await axios.get(`${BACKEND_URL}/available_year_air`);
        const sortedYears = yearsResponse.data.sort((a, b) => b - a);
        setAvailableYears(sortedYears);

        if (sortedYears.length === 0) {
          setError('No available years found.');
          setLoadingYears(false);
          return;
        }

        const latestYear = sortedYears[0];
        setSelectedYear(latestYear);

        const dataResponse = await axios.get(`${BACKEND_URL}/airquality_data`, {
          params: { year: latestYear }
        });

        const dataForYear = dataResponse.data;

        if (dataForYear.length === 0) {
          setError('No data available for the latest year.');
          setSelectedMonth('');
          setChartData({
            labels: ['CO', 'NO₂', 'SO₂'],
            datasets: [
              {
                label: 'Air Quality',
                data: [0, 0, 0],
                borderColor: [],
                backgroundColor: [],
                borderWidth: 1
              }
            ]
          });
          setLoadingYears(false);
          return;
        }

        let latestMonth = dataForYear[0].month;
        dataForYear.forEach(item => {
          if (monthOrder[item.month] > monthOrder[latestMonth]) {
            latestMonth = item.month;
          }
        });
        setSelectedMonth(latestMonth);
      } catch (err) {
        setError('Failed to load available years or data.');
      } finally {
        setLoadingYears(false);
      }
    };

    fetchLatestData();
  }, [BACKEND_URL]);

  useEffect(() => {
    if (onMonthYearChange2) {
      onMonthYearChange2(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, onMonthYearChange2]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear || !selectedMonth) {
        setChartData({
          labels: ['CO', 'NO₂', 'SO₂'],
          datasets: [
            {
              label: 'Air Quality',
              data: [0, 0, 0],
              borderColor: [],
              backgroundColor: [],
              borderWidth: 1
            }
          ]
        });
        return;
      }

      setLoadingData(true);
      setError(null);
      try {
        const response = await axios.get(`${BACKEND_URL}/airquality_data`, {
          params: {
            year: selectedYear,
            month: selectedMonth
          }
        });

        const data = response.data;

        if (data.length > 0) {
          const aggregated = {
            CO: (data.reduce((sum, item) => sum + (item.CO || 0), 0) / data.length).toFixed(2),
            NO2: (data.reduce((sum, item) => sum + (item.NO2 || 0), 0) / data.length).toFixed(2),
            SO2: (data.reduce((sum, item) => sum + (item.SO2 || 0), 0) / data.length).toFixed(2),
          };

          const pollutants = ['CO', 'NO2', 'SO2'];
          const values = [aggregated.CO, aggregated.NO2, aggregated.SO2];
          const backgroundColors = [];
          const borderColors = [];

          values.forEach((value, index) => {
            const pollutant = pollutants[index];
            const category = getAqiCategory(pollutant, parseFloat(value));
            const backgroundColor = categoryBackgroundColors[category] || categoryBackgroundColors['Unknown'];
            const borderColor = categoryColors[category] || categoryColors['Unknown'];
            backgroundColors.push(backgroundColor);
            borderColors.push(borderColor);
          });

          setChartData({
            labels: ['CO', 'NO₂', 'SO₂'],
            datasets: [
              {
                label: 'Air Quality',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
              }
            ]
          });

          originalChartData.current = aggregated;
        } else {
          setError(`No available data for ${selectedMonth} ${selectedYear}.`);
          setChartData({
            labels: ['CO', 'NO₂', 'SO₂'],
            datasets: [
              {
                label: 'Air Quality',
                data: [0, 0, 0],
                backgroundColor: [
                  categoryBackgroundColors['Unknown'],
                  categoryBackgroundColors['Unknown'],
                  categoryBackgroundColors['Unknown']
                ],
                borderColor: [
                  categoryColors['Unknown'],
                  categoryColors['Unknown'],
                  categoryColors['Unknown']
                ],
                borderWidth: 1
              }
            ]
          });
        }
      } catch (err) {
        setError('Failed to load air quality data.');
        setChartData({
          labels: ['CO', 'NO₂', 'SO₂'],
          datasets: [
            {
              label: 'Air Quality',
              data: [0, 0, 0],
              backgroundColor: [
                categoryBackgroundColors['Unknown'],
                categoryBackgroundColors['Unknown'],
                categoryBackgroundColors['Unknown']
              ],
              borderColor: [
                categoryColors['Unknown'],
                categoryColors['Unknown'],
                categoryColors['Unknown']
              ],
              borderWidth: 1
            }
          ]
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, BACKEND_URL]);

  const handleYearChange = async (e) => {
    const newYear = parseInt(e.target.value, 10);
    setSelectedYear(newYear);
    setSelectedMonth('');
    setChartData({
      labels: ['CO', 'NO₂', 'SO₂'],
      datasets: [
        {
          label: 'Air Quality',
          data: [0, 0, 0],
          borderColor: [],
          backgroundColor: [],
          borderWidth: 1
        }
      ]
    });
    setError(null);
    setLoadingYears(true);
    try {
      const dataResponse = await axios.get(`${BACKEND_URL}/airquality_data`, {
        params: { year: newYear }
      });

      const dataForYear = dataResponse.data;

      if (dataForYear.length === 0) {
        setError('No data available for the selected year.');
        setSelectedMonth('');
        setChartData({
          labels: ['CO', 'NO₂', 'SO₂'],
          datasets: [
            {
              label: 'Air Quality',
              data: [0, 0, 0],
              borderColor: [],
              backgroundColor: [],
              borderWidth: 1
            }
          ]
        });
        setLoadingYears(false);
        return;
      }

      let latestMonth = dataForYear[0].month;
      dataForYear.forEach(item => {
        if (monthOrder[item.month] > monthOrder[latestMonth]) {
          latestMonth = item.month;
        }
      });
      setSelectedMonth(latestMonth);
    } catch (err) {
      setError('Failed to load data for the selected year.');
    } finally {
      setLoadingYears(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: selectedMonth && selectedYear ? `Air Quality in CvSU - Indang Campus for ${selectedMonth} ${selectedYear}` : 'Air Quality Index',
        font: {
          size: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const pollutant = context.label;
            const value = context.parsed.y;
            const pollutantKey = pollutant.replace('₂', '2');

            if (value === null || value === undefined || isNaN(value)) {
              return `${pollutant}: No data`;
            }

            const category = getAqiCategory(pollutantKey, parseFloat(value));
            return `${pollutant}: ${value} (${category})`;
          }
        }
      }
    }
  };

  return (
    <div className="p-6 text-gray-800  -mt-6">
      <div className="w-full flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">Air Quality in CvSU - Main Campus</h2>
        <div className="flex gap-4">
          <select
            className="p-2 border rounded-md text-sm"
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={loadingData || !selectedYear}
          >
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded-md text-sm"
            value={selectedYear}
            onChange={handleYearChange}
            disabled={loadingYears}
          >
            <option value="">Select Year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {(loadingYears || loadingData) && <p className="text-center text-blue-500">Loading data...</p>}

      {/*Bar chart*/}
      <div className="w-full" style={{ height: "280px" }}> 
        <Bar data={chartData} options={options} />
      </div>

      {!loadingData && !error && (
        <div className="mt-4 flex flex-wrap justify-center gap-6">
          {Object.keys(categoryColors).filter(cat => cat !== 'Unknown').map(category => (
            <div key={category} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full" style={{ backgroundColor: categoryColors[category] }}></span>
              <span>{category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AirQualityChart;
