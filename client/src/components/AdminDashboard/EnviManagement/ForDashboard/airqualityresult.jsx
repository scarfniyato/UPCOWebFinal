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
  const categoryPriority = [
    'Good',
    'Satisfactory',
    'Moderately Polluted',
    'Poor',
    'Very Poor',
    'Severe'
  ];
  return categories.reduce((worst, current) => {
    return categoryPriority.indexOf(current) > categoryPriority.indexOf(worst)
      ? current
      : worst;
  }, 'Good');
};

// Helper array to sort months if they're stored as strings
const monthsOrder = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function AirQualityResult() {
  const [concludedStatus, setConcludedStatus] = useState('');
  const [latestYear, setLatestYear] = useState(null);
  const [latestMonth, setLatestMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        // 1. Fetch available years
        const yearsResponse = await axios.get('http://localhost:3001/available_year_air');
        const sortedYears = yearsResponse.data.sort((a, b) => b - a); // Sort years descending
        const year = sortedYears[0]; // Latest year
        setLatestYear(year);

        if (!year) {
          setError('No years available');
          setLoading(false);
          return;
        }

        // 2. Fetch ALL data for that latest year
        const dataResponse = await axios.get('http://localhost:3001/airquality_data', {
          params: { year }
        });

        const dataForYear = dataResponse.data;
        if (dataForYear.length === 0) {
          setError('No data available for the latest year.');
          setLoading(false);
          return;
        }

        // 3. Sort data by month to find the "latest" month
        //    (If months are numeric, just sort by b.month - a.month)
        dataForYear.sort((a, b) =>
          monthsOrder.indexOf(b.month) - monthsOrder.indexOf(a.month)
        );

        const latest = dataForYear[0]; // The single latest record
        if (!latest) {
          setError('No data found for the latest month.');
          setLoading(false);
          return;
        }

        setLatestMonth(latest.month);

        // OPTIONAL: If you want to compute an average for all records within that month,
        //           filter the array to get only the same month, then average them.
        //           If you just want that single record, skip this step.

        const sameMonthData = dataForYear.filter(
          (item) => item.month === latest.month
        );

        // 4. Compute aggregator (or single record values) for that month
        const aggregated = {
          CO: (
            sameMonthData.reduce((sum, item) => sum + (item.CO || 0), 0) /
            sameMonthData.length
          ).toFixed(2),
          NO2: (
            sameMonthData.reduce((sum, item) => sum + (item.NO2 || 0), 0) /
            sameMonthData.length
          ).toFixed(2),
          SO2: (
            sameMonthData.reduce((sum, item) => sum + (item.SO2 || 0), 0) /
            sameMonthData.length
          ).toFixed(2),
        };

        // 5. Get the category for each pollutant
        const categories = [
          getAqiCategory('CO', parseFloat(aggregated.CO)),
          getAqiCategory('NO2', parseFloat(aggregated.NO2)),
          getAqiCategory('SO2', parseFloat(aggregated.SO2))
        ];

        // 6. Determine the worst category
        const worstCategory = getWorstCategory(categories);
        setConcludedStatus(worstCategory);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch data.');
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
        <>
          <div className='fbold text-4xl'>{concludedStatus}</div>
          {/* Display the latest month & year we found */}
          <div className='fnormal text-sm  mt-2'>
            Air Quality For {latestMonth} {latestYear}
          </div>
          <span className='text-xs text-fcolor'>
            (Based on AQI of the US Environmental Protection)
          </span>
        </>
      )}
    </div>
  );
}

export default AirQualityResult;
