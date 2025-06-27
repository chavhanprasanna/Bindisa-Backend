const express = require('express');
const router = express.Router();
const authController = require('../auth.controller.js');
const { loginValidation, otpValidation, validate } = require('../middleware/validation.middleware');

router.post('/login', loginValidation, validate, authController.login);
router.post('/otp-verify', otpValidation, validate, authController.verifyOtp);

module.exports = router;