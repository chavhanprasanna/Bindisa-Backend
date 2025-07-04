const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Corresponds to ID in SQL
  name: { type: String, required: true, unique: true }
});

const Crop = mongoose.models.Crop || mongoose.model('Crop', cropSchema);

module.exports = Crop;
