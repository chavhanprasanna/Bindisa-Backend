const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
  soil_test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilTest', required: true },
  suggestion: String,
  warning: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema); 