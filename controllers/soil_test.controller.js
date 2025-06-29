const SoilTest = require('../models/soil_test');
const User = require('../models/user');

const { body, validationResult } = require('express-validator');

exports.createSoilTest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = errors.array();
      return next(err);
    }
    const { ph, nitrogen, phosphorus, potassium, moisture, ec, location } = req.body;
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
    next(error);
  }
};

exports.getSoilTests = async (req, res) => {
  try {
    const { startDate, endDate, location } = req.query;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const query = { user_id: req.user._id };

    // Add optional filters
    if (startDate) query.test_time = { $gte: new Date(startDate) };
    if (endDate) query.test_time = { ...query.test_time, $lte: new Date(endDate) };
    if (location) query.location = location;

    const total = await SoilTest.countDocuments(query);
    const soilTests = await SoilTest.find(query)
      .sort({ test_time: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user_id', 'name');

    res.json({
      success: true,
      data: soilTests,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
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

// PUT /soil-tests/:testId
exports.updateSoilTest = async (req, res, next) => {
  await body('ph').optional().toFloat().run(req);
  await body('nitrogen').optional().toFloat().run(req);
  await body('phosphorus').optional().toFloat().run(req);
  await body('potassium').optional().toFloat().run(req);
  await body('moisture').optional().toFloat().run(req);
  await body('ec').optional().toFloat().run(req);
  await body('location').optional().trim().escape().run(req);
  await body('test_time').optional().isISO8601().run(req);
  try {
    const { testId } = req.params;
    const updateFields = req.body;
    // Only allow update if the test belongs to the authenticated user
    const soilTest = await SoilTest.findOneAndUpdate(
      { _id: testId, user_id: req.user._id },
      updateFields,
      { new: true }
    );
    if (!soilTest) {
      return res.status(404).json({
        success: false,
        message: 'Soil test not found or not owned by user'
      });
    }
    res.json({
      success: true,
      message: 'Soil test updated successfully',
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

// POST /soil-tests/:testId/recommendation
exports.getRecommendation = async (req, res) => {
  try {
    const { testId } = req.params;
    const soilTest = await SoilTest.findOne({ _id: testId, user_id: req.user._id });
    if (!soilTest) {
      return res.status(404).json({ success: false, message: 'Soil test not found or not owned by user' });
    }
    // Mock AI recommendation logic
    const recommendation = {
      suggested_crop: soilTest.nitrogen > 40 ? 'Wheat' : 'Rice',
      fertilizer: soilTest.ph < 6.5 ? 'Lime' : 'Urea',
      notes: 'This is a mock recommendation. Integrate with real AI for production.'
    };
    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
