const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Corresponds to ID in SQL
  name: { type: String, required: true, unique: true },
  nitrogen_percent: { type: Number, required: true },
  phosphorus_percent: { type: Number, required: true },
  potassium_percent: { type: Number, required: true },
  ph_effect: { type: String, required: true }
});

const Fertilizer = mongoose.models.Fertilizer || mongoose.model('Fertilizer', fertilizerSchema);

module.exports = Fertilizer;
