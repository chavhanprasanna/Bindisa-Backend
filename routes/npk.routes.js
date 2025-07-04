const express = require('express');
const router = express.Router();
const npkController = require('../controllers/npk.controller');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { auth, authorize } = require('../middleware/auth.middleware');
const ROLES = require('../utils/roles');

const analyzeSoilValidation = [
  body('n').isFloat({ min: 0 }).withMessage('Nitrogen (N) must be a non-negative number.'),
  body('p').isFloat({ min: 0 }).withMessage('Phosphorus (P) must be a non-negative number.'),
  body('k').isFloat({ min: 0 }).withMessage('Potassium (K) must be a non-negative number.'),
  body('ph').isFloat({ min: 0, max: 14 }).withMessage('pH must be a number between 0 and 14.'),
  body('cropId').isInt({ min: 1 }).withMessage('Crop ID must be a positive integer.'),
  body('stateId').isInt({ min: 1 }).withMessage('State ID must be a positive integer.'),
  body('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer.'),
];

// Route for NPK soil analysis
router.post('/analyze', auth, authorize([ROLES.FARMER, ROLES.EXPERT, ROLES.ADMIN]), analyzeSoilValidation, validate, npkController.analyzeSoil);

module.exports = router;
