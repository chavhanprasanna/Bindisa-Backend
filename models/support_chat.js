const mongoose = require('mongoose');

const supportChatSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  sender_type: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportChat', supportChatSchema); 