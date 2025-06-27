const express = require('express');
const router = express.Router();
const dashboardController = require('../dashboard.controller.js');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/data', authMiddleware, dashboardController.getDashboardData);

module.exports = router;