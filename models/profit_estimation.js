const mongoose = require('mongoose');

const profitEstimationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  land_size: Number,
  seed_cost: Number,
  fertilizer_cost: Number,
  labor_cost: Number,
  irrigation_cost: Number,
  expected_yield: Number,
  expected_revenue: Number,
  net_profit: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfitEstimation', profitEstimationSchema); 