// routes/auth.routes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller.js');

// Login routes
router.post("/login", authController.login);
router.post("/login-password", authController.loginPassword);

// Verify OTP
router.post("/verify-otp", authController.verifyOtp);

// Logout
router.post("/logout", authController.logout);

module.exports = router;