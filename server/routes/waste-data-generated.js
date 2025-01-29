const express = require('express');
const router = express.Router();
const College = require('../models/College');

//Get filtered waste data by month and year
router.get('/waste-data-generated', async (req, res) => {
  const { month, year } = req.query;

  try {
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const filteredData = await College.find({ month, year: Number(year) });
    if (!filteredData || filteredData.length === 0) {
      return res.status(404).json({ message: 'No data found for the selected filters' });
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching filtered waste data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get all distinct years that exist in the database, sorted in descending order
router.get('/waste-data-years', async (req, res) => {
  try {
    const years = await College.distinct('year');
    const sortedYears = years.sort((a, b) => b - a); // Sort years in descending order
    res.json(sortedYears);
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).json({ error: 'Failed to fetch years' });
  }
});

// Get top 10 waste generators by month and year
router.get('/top10-waste-generators', async (req, res) => {
  const { month, year } = req.query;

  try {
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const top10Data = await College.find({ month, year: Number(year) })
      .sort({ totalKg: -1 }) // Sort by totalKg in descending order
      .limit(10); // Limit to top 10 results

    res.json(top10Data);
  } catch (error) {
    console.error('Error fetching top 10 waste generators:', error);
    res.status(500).json({ error: 'Failed to fetch top 10 data' });
  }
});

// Get the latest waste data for each college
router.get('/latest-waste-data', async (req, res) => {
  try {
    const latestData = await College.aggregate([
      { $sort: { year: -1, month: -1 } }, // Sort by year and month in descending order
      {
        $group: {
          _id: '$id', // Group by college ID
          id: { $first: '$id' },
          name: { $first: '$name' },
          totalKg: { $first: '$totalKg' },
          month: { $first: '$month' },
          year: { $first: '$year' },
        },
      },
    ]);

    res.json(latestData);
  } catch (error) {
    console.error('Error fetching latest waste data:', error);
    res.status(500).json({ error: 'Failed to fetch latest data' });
  }
});

module.exports = router;






