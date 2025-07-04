const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const State = require('../models/state.model');
const District = require('../models/district.model');
const Crop = require('../models/crop.model');
const CropRequirement = require('../models/crop_requirement.model');
const Fertilizer = require('../models/fertilizer.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bindisa';

const importData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for NPK data import.');

    // Clear existing data (optional, for clean import)
    await State.deleteMany({});
    await District.deleteMany({});
    await Crop.deleteMany({});
    await CropRequirement.deleteMany({});
    await Fertilizer.deleteMany({});
    console.log('Existing NPK data cleared.');

    // Data from soil_npk.sql
    const statesData = [
      { id: 1, name: 'Punjab' }, { id: 2, name: 'Bihar' }, { id: 3, name: 'Maharashtra' },
      { id: 4, name: 'Gujarat' }, { id: 5, name: 'Uttar Pradesh' }, { id: 6, name: 'Rajasthan' },
      { id: 7, name: 'Madhya Pradesh' }, { id: 8, name: 'Karnataka' }, { id: 9, name: 'Tamil Nadu' },
      { id: 10, name: 'Andhra Pradesh' }
    ];

    const districtsData = [
      { state_id: 1, id: 1, name: 'Ludhiana' }, { state_id: 1, id: 2, name: 'Amritsar' }, { state_id: 1, id: 3, name: 'Patiala' },
      { state_id: 2, id: 4, name: 'Patna' }, { state_id: 2, id: 5, name: 'Gaya' }, { state_id: 2, id: 6, name: 'Muzaffarpur' },
      { state_id: 3, id: 7, name: 'Pune' }, { state_id: 3, id: 8, name: 'Mumbai' }, { state_id: 3, id: 9, name: 'Nagpur' },
      { state_id: 4, id: 10, name: 'Surat' }, { state_id: 4, id: 11, name: 'Ahmedabad' }, { state_id: 4, id: 12, name: 'Vadodara' },
      { state_id: 5, id: 13, name: 'Varanasi' }, { state_id: 5, id: 14, name: 'Lucknow' }, { state_id: 5, id: 15, name: 'Agra' },
      { state_id: 6, id: 16, name: 'Jaipur' }, { state_id: 6, id: 17, name: 'Jodhpur' }, { state_id: 6, id: 18, name: 'Udaipur' },
      { state_id: 7, id: 19, name: 'Bhopal' }, { state_id: 7, id: 20, name: 'Indore' }, { state_id: 7, id: 21, name: 'Jabalpur' },
      { state_id: 8, id: 22, name: 'Bangalore' }, { state_id: 8, id: 23, name: 'Mysore' }, { state_id: 8, id: 24, name: 'Hubli' },
      { state_id: 9, id: 25, name: 'Chennai' }, { state_id: 9, id: 26, name: 'Coimbatore' }, { state_id: 9, id: 27, name: 'Madurai' },
      { state_id: 10, id: 28, name: 'Hyderabad' }, { state_id: 10, id: 29, name: 'Visakhapatnam' }, { state_id: 10, id: 30, name: 'Vijayawada' }
    ];

    const cropsData = [
      { id: 1, name: 'Wheat' }, { id: 2, name: 'Rice' }, { id: 3, name: 'Maize' },
      { id: 4, name: 'Cotton' }, { id: 5, name: 'Sugarcane' }, { id: 6, name: 'Soybean' },
      { id: 7, name: 'Groundnut' }, { id: 8, name: 'Potato' }, { id: 9, name: 'Tomato' },
      { id: 10, name: 'Onion' }
    ];

    const cropRequirementsData = [
      { crop_id: 1, state_id: 1, district_id: 1, required_n: 120, required_p: 60, required_k: 40, min_ph: 6.0, max_ph: 7.5 },
      { crop_id: 1, state_id: 2, district_id: 4, required_n: 110, required_p: 55, required_k: 35, min_ph: 6.0, max_ph: 7.5 },
      { crop_id: 1, state_id: 3, district_id: 7, required_n: 130, required_p: 65, required_k: 45, min_ph: 6.0, max_ph: 7.5 },

      { crop_id: 2, state_id: 1, district_id: 1, required_n: 100, required_p: 50, required_k: 35, min_ph: 5.5, max_ph: 7.0 },
      { crop_id: 2, state_id: 2, district_id: 4, required_n: 90, required_p: 45, required_k: 30, min_ph: 5.5, max_ph: 7.0 },
      { crop_id: 2, state_id: 3, district_id: 7, required_n: 110, required_p: 55, required_k: 40, min_ph: 5.5, max_ph: 7.0 },

      { crop_id: 3, state_id: 1, district_id: 1, required_n: 150, required_p: 70, required_k: 50, min_ph: 5.8, max_ph: 7.2 },
      { crop_id: 3, state_id: 2, district_id: 4, required_n: 140, required_p: 65, required_k: 45, min_ph: 5.8, max_ph: 7.2 },
      { crop_id: 3, state_id: 3, district_id: 7, required_n: 160, required_p: 75, required_k: 55, min_ph: 5.8, max_ph: 7.2 },

      { crop_id: 4, state_id: 4, district_id: 10, required_n: 160, required_p: 80, required_k: 60, min_ph: 6.2, max_ph: 7.8 },
      { crop_id: 4, state_id: 3, district_id: 7, required_n: 150, required_p: 75, required_k: 55, min_ph: 6.2, max_ph: 7.8 },
      { crop_id: 4, state_id: 10, district_id: 28, required_n: 170, required_p: 85, required_k: 65, min_ph: 6.2, max_ph: 7.8 },

      { crop_id: 5, state_id: 5, district_id: 13, required_n: 180, required_p: 90, required_k: 80, min_ph: 5.5, max_ph: 7.5 },
      { crop_id: 5, state_id: 9, district_id: 25, required_n: 170, required_p: 85, required_k: 75, min_ph: 5.5, max_ph: 7.5 },
      { crop_id: 5, state_id: 3, district_id: 7, required_n: 190, required_p: 95, required_k: 85, min_ph: 5.5, max_ph: 7.5 }
    ];

    const fertilizersData = [
      { id: 1, name: 'Urea', nitrogen_percent: 46, phosphorus_percent: 0, potassium_percent: 0, ph_effect: 'Increases soil acidity' },
      { id: 2, name: 'DAP (Diammonium Phosphate)', nitrogen_percent: 18, phosphorus_percent: 46, potassium_percent: 0, ph_effect: 'Slightly decreases pH' },
      { id: 3, name: 'MOP (Muriate of Potash)', nitrogen_percent: 0, phosphorus_percent: 0, potassium_percent: 60, ph_effect: 'Neutral effect' },
      { id: 4, name: 'NPK 10-26-26', nitrogen_percent: 10, phosphorus_percent: 26, potassium_percent: 26, ph_effect: 'Neutral effect' },
      { id: 5, name: 'Organic Compost', nitrogen_percent: 2, phosphorus_percent: 1, potassium_percent: 1.5, ph_effect: 'Increases soil alkalinity' }
    ];

    await State.insertMany(statesData);
    await District.insertMany(districtsData);
    await Crop.insertMany(cropsData);
    await CropRequirement.insertMany(cropRequirementsData);
    await Fertilizer.insertMany(fertilizersData);

    console.log('NPK data imported successfully!');
  } catch (error) {
    console.error('Error importing NPK data:', error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
};

importData();
