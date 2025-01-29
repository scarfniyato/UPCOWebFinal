const express = require('express');
const router = express.Router();
const College = require('../models/College');

//Fetch all colleges
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

//Get latest month and year with data
router.get('/latest-waste-data', async (req, res) => {
  try {
    const monthMapping = {
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
      July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
    };

    //Fetch records then sort by year and numerical month
    const latestData = await College.find()
      .sort({ year: -1, month: 1 }) //year: descending; month: ascending
      .then(data =>
        data.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return monthMapping[b.month] - monthMapping[a.month];
        })[0]
      );

    if (!latestData) return res.status(404).json({ message: 'No data available' });

    //Return the latest month and year
    res.json({ month: latestData.month, year: latestData.year });
  } catch (error) {
    console.error('Error fetching latest waste data:', error);
    res.status(500).json({ message: 'Failed to fetch latest data' });
  }
});

//Check if waste data exists for a specific month and year
router.get('/waste-data-exists', async (req, res) => {
  const { month, year } = req.query;

  try {
    const exists = await College.exists({ month, year: Number(year) });
    res.json(!!exists);
  } catch (error) {
    console.error('Error checking for existing waste data:', error);
    res.status(500).json({ message: 'Failed to check for existing data' });
  }
});

//For Saving waste data
router.post('/waste-data', async (req, res) => {
  try {
    const data = req.body; 
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    //Save all data into the database
    await College.insertMany(data);

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving waste data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});

module.exports = router;

