const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller.js');

router.get('/data', dashboardController.getDashboardData);

module.exports = router;
