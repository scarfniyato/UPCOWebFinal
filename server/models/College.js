const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  id: Number, // Add an id field to match markers
  name: String,
  totalKg: Number,
  month: String,
  year: Number,
});

module.exports = mongoose.model('College', CollegeSchema);
