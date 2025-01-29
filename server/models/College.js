const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  id: Number, //added id for markers since autohashed sa db
  name: String,
  totalKg: Number,
  month: String,
  year: Number,
});

module.exports = mongoose.model('College', CollegeSchema);
