const CropSuggestion = require('../models/crop_suggestion');
const { body, validationResult } = require('express-validator');

exports.createCropSuggestion = async (req, res, next) => {
  await body('soil_test_id').notEmpty().isMongoId().run(req);
  await body('suggested_crop').notEmpty().trim().escape().run(req);
  await body('rotation_advice').optional().trim().escape().run(req);
  await body('weather_data').optional().trim().run(req);
  await body('region').optional().trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }

  try {
    const suggestion = new CropSuggestion(req.body);
    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (err) {
    next(err);
  }
};

exports.getCropSuggestions = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const total = await CropSuggestion.countDocuments();
    const suggestions = await CropSuggestion.find()
      .populate('soil_test_id')
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ suggestions, total, page, pages: Math.ceil(total / limit), limit });
  } catch (err) {
    next(err);
  }
};

exports.getCropSuggestionById = async (req, res, next) => {
  try {
    const suggestion = await CropSuggestion.findById(req.params.id).populate('soil_test_id');
    if (!suggestion) {
      const err = new Error('CropSuggestion not found');
      err.status = 404;
      return next(err);
    }
    res.json(suggestion);
  } catch (err) {
    next(err);
  }
};

exports.updateCropSuggestion = async (req, res, next) => {
  await body('soil_test_id').optional().isMongoId().run(req);
  await body('suggested_crop').optional().trim().escape().run(req);
  await body('rotation_advice').optional().trim().escape().run(req);
  await body('weather_data').optional().trim().run(req);
  await body('region').optional().trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const suggestion = await CropSuggestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!suggestion) {
      const err = new Error('CropSuggestion not found');
      err.status = 404;
      return next(err);
    }
    res.json(suggestion);
  } catch (err) {
    next(err);
  }
};

exports.deleteCropSuggestion = async (req, res, next) => {
  try {
    const suggestion = await CropSuggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) {
      const err = new Error('CropSuggestion not found');
      err.status = 404;
      return next(err);
    }
    res.json({ message: 'CropSuggestion deleted' });
  } catch (err) {
    next(err);
  }
};
