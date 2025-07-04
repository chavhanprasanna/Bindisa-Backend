const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller.js');
const { auth } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(auth);

// Dashboard routes
router.get('/data', dashboardController.getDashboardData);

module.exports = router;