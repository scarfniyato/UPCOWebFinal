import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define AQI categories for each pollutant
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

// Function to get AQI category based on pollutant and value
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

// Function to get the worst category among the pollutants
const getWorstCategory = (categories) => {
  const categoryPriority = ['Good', 'Satisfactory', 'Moderately Polluted', 'Poor', 'Very Poor', 'Severe'];
  return categories.reduce((worst, current) => {
    return categoryPriority.indexOf(current) > categoryPriority.indexOf(worst) ? current : worst;
  }, 'Good');
};

function AirQualityResult() {
  const [concludedStatus, setConcludedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        // Fetch available years
        const yearsResponse = await axios.get('http://localhost:3001/available_year_air');
        const sortedYears = yearsResponse.data.sort((a, b) => b - a); // Sort years in descending order
        const latestYear = sortedYears[0]; // Get the latest year

        // Fetch data for the latest year
        const dataResponse = await axios.get('http://localhost:3001/airquality_data', {
          params: { year: latestYear }
        });

        const data = dataResponse.data;

        if (data.length === 0) {
          setError('No data available for the latest year.');
          setLoading(false);
          return;
        }

        // Aggregating data for the latest year
        const aggregated = {
          CO: (data.reduce((sum, item) => sum + (item.CO || 0), 0) / data.length).toFixed(2),
          NO2: (data.reduce((sum, item) => sum + (item.NO2 || 0), 0) / data.length).toFixed(2),
          SO2: (data.reduce((sum, item) => sum + (item.SO2 || 0), 0) / data.length).toFixed(2),
        };

        // Get the category for each pollutant
        const categories = [
          getAqiCategory('CO', parseFloat(aggregated.CO)),
          getAqiCategory('NO2', parseFloat(aggregated.NO2)),
          getAqiCategory('SO2', parseFloat(aggregated.SO2)),
        ];

        // Determine the worst category from the pollutants
        const worstCategory = getWorstCategory(categories);
        setConcludedStatus(worstCategory);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestData();
  }, []);

  return (
    <div className="chart-container" style={{ color: '#333333' }}>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
          <p>
            <div className='fbold text-5xl'>{concludedStatus}</div>
            <div className='fnormal text-sm'>Air Quality For The Month</div>
            <p className='text-xs text-fcolor'>(based on AQI of the US Environmental Protection)</p>
          </p>
      )}
    </div>
  );
}

export default AirQualityResult;
