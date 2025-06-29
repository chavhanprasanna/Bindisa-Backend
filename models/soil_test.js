const mongoose = require('mongoose');

const soilTestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ph: Number,
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
  moisture: Number,
  ec: Number,
  test_time: Date,
  location: String
}, {
  timestamps: true
});

module.exports = mongoose.model('SoilTest', soilTestSchema); 