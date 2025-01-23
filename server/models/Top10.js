const mongoose = require('mongoose');

const Top10Schema = new mongoose.Schema({
  rank: Number,
  college: String,
  totalKg: Number,
});

module.exports = mongoose.model('Top10', Top10Schema);