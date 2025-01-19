import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

function WasteQualityChart() {
  const [allData, setAllData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
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
        const formattedData = formatChartData(data, latestYear);
        setChartData(formattedData);
      })
      .catch(err => console.log('Error fetching data:', err));
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const filteredData = allData.filter(item => item.year === Number(selectedYear));
      const formattedData = formatChartData(filteredData, selectedYear);
      setChartData(formattedData);
    }
  }, [selectedYear, allData]);

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
        pointBackgroundColor: '#FF9F1A' 
      },
      { 
        label: 'Biodegradables', 
        data: [], 
        borderColor: '#2489e1', 
        backgroundColor: 'rgba(23, 131, 230, 0.5)', 
        fill: true, 
        pointRadius: 3, 
        pointBackgroundColor: '#2489e1' 
      },
      { 
        label: 'Recyclables', 
        data: [], 
        borderColor: '#4d8833', 
        backgroundColor: 'rgba(87, 141, 60, 0.3)',  
        fill: true, 
        pointRadius: 3, 
        pointBackgroundColor: '#4d8833' 
      }
    ];

    months.forEach(month => {
      const monthData = data.filter(item => item.month === month);
      const residualTotal = monthData.reduce((acc, cur) => acc + (cur.residual || 0), 0);
      const biodegradableTotal = monthData.reduce((acc, cur) => acc + (cur.biodegradable || 0), 0);
      const recyclableTotal = monthData.reduce((acc, cur) => acc + (cur.recyclable || 0), 0);
      
      datasets[0].data.push(residualTotal);
      datasets[1].data.push(biodegradableTotal);
      datasets[2].data.push(recyclableTotal);
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
        intersect: false
      },
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Solid Waste Generated Chart',
        font: {
          size: 15
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months'
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    }
  };  

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div style={{ color: '#333333', padding: '20px' }}>
      <h4><strong>Solid Waste Generated in CvSU - Main Campus</strong></h4>
      
      <div className="row mb-4">
        <div className="col-md-3 d-flex align-items-center">
          <label htmlFor="yearSelect" style={{marginTop: '15px', marginRight: '10px', whiteSpace: 'nowrap' }}>Select Year:</label>
          <select
            id="yearSelect"
            className="form-select"
            value={selectedYear}
            onChange={handleYearChange}
            style={{ padding: '4px', marginTop: '15px' }}
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
      
      <div style={{ width: '100%', height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default WasteQualityChart;
