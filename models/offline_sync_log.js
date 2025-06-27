const mongoose = require('mongoose');

const offlineSyncLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  synced: { type: Boolean, default: false },
  data_summary: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OfflineSyncLog', offlineSyncLogSchema); 