// routes/auth.routes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller.js');

router.post('/login', authController.login);
router.post('/otp-verify', authController.verifyOtp);

module.exports = router;