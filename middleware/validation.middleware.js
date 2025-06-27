const { body, validationResult } = require('express-validator');

const loginValidation = [
  body('mobile')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Invalid mobile number format'),
];

const otpValidation = [
  body('mobile')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Invalid mobile number format'),
  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .matches(/^[0-9]{6}$/)
    .withMessage('Invalid OTP format')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  loginValidation,
  otpValidation,
  validate,
  validationMiddleware: validate // alias for global use
};