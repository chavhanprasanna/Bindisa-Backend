const mongoose = require('mongoose');

const cropSuggestionSchema = new mongoose.Schema({
  soil_test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilTest', required: true },
  weather_data: String,
  suggested_crop: String,
  rotation_advice: String,
  region: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CropSuggestion', cropSuggestionSchema); 