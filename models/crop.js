const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "cereal", "vegetable", "fruit"
  description: { type: String },
  season: { type: String } // e.g., "kharif", "rabi", "summer"
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);
