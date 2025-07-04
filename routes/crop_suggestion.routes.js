const express = require('express');
const router = express.Router();
const cropSuggestionController = require('../controllers/crop_suggestion.controller');
const { auth, authorize, ROLES } = require('../middleware/auth.middleware');

// Assuming only expert & admin can create/update suggestions; farmers can read their own suggestions
router.post('/', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropSuggestionController.createCropSuggestion);
router.get('/', auth, cropSuggestionController.getCropSuggestions);
router.get('/:id', auth, cropSuggestionController.getCropSuggestionById);
router.put('/:id', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropSuggestionController.updateCropSuggestion);
router.delete('/:id', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropSuggestionController.deleteCropSuggestion);

module.exports = router;
