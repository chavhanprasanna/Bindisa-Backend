const express = require('express');
const router = express.Router();
const soilTestController = require('../controllers/soil_test.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes
router.post('/', authMiddleware, soilTestController.createSoilTest);
router.get('/', authMiddleware, soilTestController.getSoilTests);
router.get('/latest', authMiddleware, soilTestController.getLatestSoilTest);
router.delete('/:testId', authMiddleware, soilTestController.deleteSoilTest);

module.exports = router;
