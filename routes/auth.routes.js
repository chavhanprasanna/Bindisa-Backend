const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { body } = require('express-validator');
const { loginValidation, otpValidation, validate } = require('../middleware/validation.middleware');

// Login with OTP
router.post('/login', loginValidation, validate, authController.login);

// Login with password
const passwordLoginValidation = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
router.post('/login-password', passwordLoginValidation, validate, authController.loginPassword);

// Verify OTP
router.post('/otp-verify', otpValidation, validate, authController.verifyOtp);

// Logout
router.post('/logout', authController.logout);

module.exports = router;