const mongoose = require('mongoose');

const cropRequirementSchema = new mongoose.Schema({
  crop_id: { type: Number, required: true }, // Corresponds to ID in SQL
  state_id: { type: Number, required: true }, // Corresponds to ID in SQL
  district_id: { type: Number, required: true }, // Corresponds to ID in SQL
  required_n: { type: Number, required: true },
  required_p: { type: Number, required: true },
  required_k: { type: Number, required: true },
  min_ph: { type: Number, required: true },
  max_ph: { type: Number, required: true }
});

// Add a compound unique index to ensure unique crop requirements per crop, state, and district
cropRequirementSchema.index({ crop_id: 1, state_id: 1, district_id: 1 }, { unique: true });

const CropRequirement = mongoose.models.CropRequirement || mongoose.model('CropRequirement', cropRequirementSchema);

module.exports = CropRequirement;
