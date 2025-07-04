const State = require('../models/state.model');
const District = require('../models/district.model');
const Crop = require('../models/crop.model');
const CropRequirement = require('../models/crop_requirement.model');
const Fertilizer = require('../models/fertilizer.model');

// Helper function: Convert NPK from mg/kg to kg/ha
function convertToKgPerHa(value) {
  // Assuming 1 mg/kg in the top 15 cm soil layer corresponds to ~2.24 kg/ha
  return value * 2.24;
}

// Helper function: Calculate fertilizer requirement
function calculateFertilizer(measured, required, nutrientPercent) {
  if (measured >= required) {
    return 0; // No deficiency
  }
  const deficiency = required - measured;
  return (deficiency * 100) / nutrientPercent;
}

// Helper function: Get pH status
function getPHStatus(measured, min, max) {
  if (measured < min) {
    return "Acidic";
  } else if (measured > max) {
    return "Alkaline";
  } else {
    return "Optimal";
  }
}

// Helper function: Get pH recommendation
function getPHRecommendation(measured, min, max) {
  if (measured < min) {
    return "Apply agricultural lime to increase soil pH.";
  } else if (measured > max) {
    return "Apply agricultural sulfur or gypsum to decrease soil pH.";
  } else {
    return "pH is in optimal range. No adjustment needed.";
  }
}

exports.analyzeSoil = async (req, res) => {
  try {
    const { n, p, k, ph, cropId, stateId, districtId } = req.body;

    // 1. Fetch crop requirements
    let cropRequirements = await CropRequirement.findOne({
      crop_id: cropId,
      state_id: stateId,
      district_id: districtId,
    });

    // Fallback to state level if district specific data not available
    if (!cropRequirements) {
      cropRequirements = await CropRequirement.findOne({
        crop_id: cropId,
        state_id: stateId,
        district_id: { $exists: false }, // Assuming no district means state level default
      });
    }

    // Fallback to default values if no data available (as in PHP)
    if (!cropRequirements) {
      cropRequirements = {
        required_n: 120,
        required_p: 60,
        required_k: 40,
        min_ph: 6.0,
        max_ph: 7.5,
      };
    }

    // 2. Calculate fertilizer needs
    const nKgPerHa = convertToKgPerHa(n);
    const pKgPerHa = convertToKgPerHa(p);
    const kKgPerHa = convertToKgPerHa(k);

    const nFertilizerNeeded = calculateFertilizer(nKgPerHa, cropRequirements.required_n, 46); // Assuming Urea for N (46% N)
    const pFertilizerNeeded = calculateFertilizer(pKgPerHa, cropRequirements.required_p, 46); // Assuming DAP for P (46% P)
    const kFertilizerNeeded = calculateFertilizer(kKgPerHa, cropRequirements.required_k, 60); // Assuming MOP for K (60% K)

    // 3. Get pH status and recommendation
    const phStatus = getPHStatus(ph, cropRequirements.min_ph, cropRequirements.max_ph);
    const phRecommendation = getPHRecommendation(ph, cropRequirements.min_ph, cropRequirements.max_ph);

    // 4. Fetch fertilizer data for recommendations
    const fertilizers = await Fertilizer.find({});

    // Basic fertilizer recommendation logic (can be expanded)
    const recommendedFertilizers = [];
    if (nFertilizerNeeded > 0) {
      const urea = fertilizers.find(f => f.name.includes('Urea'));
      if (urea) recommendedFertilizers.push({ name: urea.name, amount_kg_per_ha: nFertilizerNeeded.toFixed(2) });
    }
    if (pFertilizerNeeded > 0) {
      const dap = fertilizers.find(f => f.name.includes('DAP'));
      if (dap) recommendedFertilizers.push({ name: dap.name, amount_kg_per_ha: pFertilizerNeeded.toFixed(2) });
    }
    if (kFertilizerNeeded > 0) {
      const mop = fertilizers.find(f => f.name.includes('MOP'));
      if (mop) recommendedFertilizers.push({ name: mop.name, amount_kg_per_ha: kFertilizerNeeded.toFixed(2) });
    }

    // 5. Fetch names for crop, state, district (for display)
    const cropName = (await Crop.findOne({ id: cropId }))?.name || 'Unknown Crop';
    const stateName = (await State.findOne({ id: stateId }))?.name || 'Unknown State';
    const districtName = (await District.findOne({ id: districtId }))?.name || 'Unknown District';

    res.status(200).json({
      message: 'Soil analysis complete',
      input: { n, p, k, ph, cropId, stateId, districtId },
      crop: cropName,
      state: stateName,
      district: districtName,
      analysis_results: {
        n_kg_per_ha: nKgPerHa.toFixed(2),
        p_kg_per_ha: pKgPerHa.toFixed(2),
        k_kg_per_ha: kKgPerHa.toFixed(2),
        n_fertilizer_needed: nFertilizerNeeded.toFixed(2),
        p_fertilizer_needed: pFertilizerNeeded.toFixed(2),
        k_fertilizer_needed: kFertilizerNeeded.toFixed(2),
        ph_status: phStatus,
        ph_recommendation: phRecommendation,
      },
      recommended_fertilizers: recommendedFertilizers,
    });

  } catch (error) {
    console.error('Error during soil analysis:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
