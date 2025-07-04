const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { auth, authorize, ROLES } = require('../middleware/auth.middleware');

// All crop routes are protected by RBAC (admin, expert)
router.post('/', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropController.createCrop);
router.get('/', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropController.getCrops);
router.get('/:id', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropController.getCropById);
router.put('/:id', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropController.updateCrop);
router.delete('/:id', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), cropController.deleteCrop);

module.exports = router;
