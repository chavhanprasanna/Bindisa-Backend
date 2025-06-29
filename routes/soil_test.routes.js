const express = require('express');
const router = express.Router();
const soilTestController = require('../controllers/soil_test.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes
const { body } = require('express-validator');

const soilTestValidation = [
  body('ph').notEmpty().withMessage('ph is required').isNumeric(),
  body('nitrogen').notEmpty().withMessage('nitrogen is required').isNumeric(),
  body('phosphorus').notEmpty().withMessage('phosphorus is required').isNumeric(),
  body('potassium').notEmpty().withMessage('potassium is required').isNumeric(),
  body('test_time').optional().isISO8601().withMessage('test_time must be a date'),
  body('location').notEmpty().withMessage('location is required')
];

router.post('/', authMiddleware, soilTestValidation, soilTestController.createSoilTest);
router.get('/', authMiddleware, soilTestController.getSoilTests);
router.get('/latest', authMiddleware, soilTestController.getLatestSoilTest);
router.delete('/:testId', authMiddleware, soilTestController.deleteSoilTest);
router.put('/:testId', authMiddleware, soilTestController.updateSoilTest);
router.post('/:testId/recommendation', authMiddleware, soilTestController.getRecommendation);

module.exports = router;
