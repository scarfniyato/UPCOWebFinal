const express = require('express');
const router = express.Router();
const College = require('../models/College'); // Make sure the model is imported

// Fetch all colleges
router.get('/colleges', (req, res) => {
  const colleges = [
    { id: 1, name: 'College of Engineering and Information Technology' },
    { id: 2, name: 'College of Agriculture, Forestry, Environment, and Natural Resources' },
    { id: 3, name: 'College of Arts and Sciences' },
    { id: 4, name: 'College of Veterinary Medicine and Biomedical Sciences' },
    { id: 5, name: 'College of Sports, Physical Education, and Recreation' },
    { id: 6, name: 'College of Criminal Justice' },
    { id: 7, name: 'College of Economics, Management, and Development Studies Old Building' },
    { id: 8, name: 'College of Economics, Management, and Development Studies - New Building' },
    { id: 9, name: 'Open Graduate School' },
    { id: 10, name: 'College of Education' },
  ];
  res.json(colleges);
});

// Get the latest month and year with data
router.get('/latest-waste-data', async (req, res) => {
  try {
    const latestData = await College.findOne().sort({ year: -1, month: -1 });
    if (!latestData) return res.status(404).json({ message: 'No data available' });

    res.json({ month: latestData.month, year: latestData.year });
  } catch (error) {
    console.error('Error fetching latest waste data:', error);
    res.status(500).json({ message: 'Failed to fetch latest data' });
  }
});

// Save waste data
router.post('/waste-data', async (req, res) => {
  try {
    const data = req.body; // Expect an array of data
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    // Save all data into the database
    await College.insertMany(data);

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving waste data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});

module.exports = router;

