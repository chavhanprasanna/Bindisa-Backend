const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Corresponds to ID in SQL
  state_id: { type: Number, required: true }, // Foreign key to State
  name: { type: String, required: true, unique: true }
});

const District = mongoose.models.District || mongoose.model('District', districtSchema);

module.exports = District;
