const mongoose = require('mongoose');

const farmingPlanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop_name: String,
  start_date: Date,
  end_date: Date,
  irrigation_advice: String,
  fertilizer_plan: String,
  pesticide_plan: String,
  cost_estimate: Number
});

module.exports = mongoose.model('FarmingPlan', farmingPlanSchema); 