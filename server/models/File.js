const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    driveId: { type: String, required: true },
    date: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('File', FileSchema);

