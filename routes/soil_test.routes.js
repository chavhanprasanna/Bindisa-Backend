const express = require('express');
const router = express.Router();
const soilTestController = require('../controllers/soil_test.controller');
const { auth } = require('../middleware/auth.middleware');

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

router.post('/', auth, soilTestValidation, soilTestController.createSoilTest);
router.get('/', auth, soilTestController.getSoilTests);
router.get('/latest', auth, soilTestController.getLatestSoilTest);
router.delete('/:testId', auth, soilTestController.deleteSoilTest);
router.put('/:testId', auth, soilTestController.updateSoilTest);
router.post('/:testId/recommendation', auth, soilTestController.getRecommendation);

module.exports = router;
