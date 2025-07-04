const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Corresponds to ID in SQL
  name: { type: String, required: true, unique: true }
});

const State = mongoose.models.State || mongoose.model('State', stateSchema);

module.exports = State;
