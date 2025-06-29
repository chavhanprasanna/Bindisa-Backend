const Crop = require('../models/crop');
const { body, validationResult } = require('express-validator');

exports.createCrop = async (req, res, next) => {
  await body('name').notEmpty().trim().escape().run(req);
  await body('type').notEmpty().trim().escape().run(req);
  await body('description').optional().trim().escape().run(req);
  await body('season').optional().trim().escape().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    next(err);
  }
};

exports.getCrops = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const total = await Crop.countDocuments();
    const crops = await Crop.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ crops, total, page, pages: Math.ceil(total / limit), limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCrop = async (req, res, next) => {
  await body('name').optional().notEmpty().trim().escape().run(req);
  await body('type').optional().notEmpty().trim().escape().run(req);
  await body('description').optional().trim().escape().run(req);
  await body('season').optional().trim().escape().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) {
      const err = new Error('Crop not found');
      err.status = 404;
      return next(err);
    }
    res.json(crop);
  } catch (err) {
    next(err);
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
