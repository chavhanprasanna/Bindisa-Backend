const SoilTest = require('../models/soil_test');
const User = require('../models/user');

exports.createSoilTest = async (req, res) => {
  try {
    const { ph, nitrogen, phosphorus, potassium, moisture, ec, location } = req.body;
    
    // Validate required fields
    if (!ph || !nitrogen || !phosphorus || !potassium) {
      return res.status(400).json({
        success: false,
        message: 'All soil parameters are required'
      });
    }

    // Create new soil test
    const soilTest = new SoilTest({
      user_id: req.user._id,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
      ec,
      location,
      test_time: new Date()
    });

    await soilTest.save();

    res.json({
      success: true,
      message: 'Soil test created successfully',
      data: soilTest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getSoilTests = async (req, res) => {
  try {
    const { startDate, endDate, location } = req.query;
    const query = { user_id: req.user._id };

    // Add optional filters
    if (startDate) query.test_time = { $gte: new Date(startDate) };
    if (endDate) query.test_time = { ...query.test_time, $lte: new Date(endDate) };
    if (location) query.location = location;

    const soilTests = await SoilTest.find(query)
      .sort({ test_time: -1 })
      .populate('user_id', 'name');

    res.json({
      success: true,
      data: soilTests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getLatestSoilTest = async (req, res) => {
  try {
    const soilTest = await SoilTest.findOne({ user_id: req.user._id })
      .sort({ test_time: -1 })
      .populate('user_id', 'name');

    if (!soilTest) {
      return res.status(404).json({
        success: false,
        message: 'No soil test found'
      });
    }

    res.json({
      success: true,
      data: soilTest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.deleteSoilTest = async (req, res) => {
  try {
    const { testId } = req.params;
    
    const soilTest = await SoilTest.findByIdAndDelete(testId);
    
    if (!soilTest) {
      return res.status(404).json({
        success: false,
        message: 'Soil test not found'
      });
    }

    res.json({
      success: true,
      message: 'Soil test deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
