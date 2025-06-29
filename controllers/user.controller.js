const User = require('../models/user');

const { body, validationResult } = require('express-validator');

exports.createUser = async (req, res, next) => {
  // Validation
  await body('phone_number').notEmpty().matches(/^[0-9]{10}$/).run(req);
  await body('name').notEmpty().run(req);
  await body('user_type').optional().isIn(['farmer', 'expert', 'admin']).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const total = await User.countDocuments();
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ users, total, page, pages: Math.ceil(total / limit), limit });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  // Validation
  await body('phone_number').optional().matches(/^[0-9]{10}$/).run(req);
  await body('name').optional().notEmpty().run(req);
  await body('user_type').optional().isIn(['farmer', 'expert', 'admin']).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    return next(err);
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}; 