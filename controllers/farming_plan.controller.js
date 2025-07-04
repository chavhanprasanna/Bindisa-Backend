const FarmingPlan = require('../models/farming_plan');
const { body, validationResult } = require('express-validator');

exports.createFarmingPlan = async (req, res, next) => {
  await body('user_id').notEmpty().isMongoId().run(req);
  await body('crop_name').notEmpty().trim().escape().run(req);
  await body('start_date').notEmpty().isISO8601().run(req);
  await body('end_date').optional().isISO8601().run(req);
  await body('irrigation_advice').optional().trim().escape().run(req);
  await body('fertilizer_plan').optional().trim().escape().run(req);
  await body('pesticide_plan').optional().trim().escape().run(req);
  await body('cost_estimate').optional().isNumeric().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const plan = new FarmingPlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
};

exports.getFarmingPlans = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const total = await FarmingPlan.countDocuments();
    const plans = await FarmingPlan.find()
      .populate('user_id')
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ plans, total, page, pages: Math.ceil(total / limit), limit });
  } catch (err) {
    next(err);
  }
};

exports.getFarmingPlanById = async (req, res, next) => {
  try {
    const plan = await FarmingPlan.findById(req.params.id).populate('user_id');
    if (!plan) {
      const err = new Error('FarmingPlan not found');
      err.status = 404;
      return next(err);
    }
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

exports.updateFarmingPlan = async (req, res, next) => {
  await body('user_id').optional().isMongoId().run(req);
  await body('crop_name').optional().trim().escape().run(req);
  await body('start_date').optional().isISO8601().run(req);
  await body('end_date').optional().isISO8601().run(req);
  await body('irrigation_advice').optional().trim().escape().run(req);
  await body('fertilizer_plan').optional().trim().escape().run(req);
  await body('pesticide_plan').optional().trim().escape().run(req);
  await body('cost_estimate').optional().isNumeric().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const plan = await FarmingPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) {
      const err = new Error('FarmingPlan not found');
      err.status = 404;
      return next(err);
    }
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

exports.deleteFarmingPlan = async (req, res, next) => {
  try {
    const plan = await FarmingPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      const err = new Error('FarmingPlan not found');
      err.status = 404;
      return next(err);
    }
    res.json({ message: 'FarmingPlan deleted' });
  } catch (err) {
    next(err);
  }
};
