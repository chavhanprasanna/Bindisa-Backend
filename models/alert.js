const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  message: String,
  type: String,
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema); 