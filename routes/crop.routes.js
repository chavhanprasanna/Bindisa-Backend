const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');

// All crop routes are protected by RBAC (admin, expert)
router.post('/', authMiddleware, rbacMiddleware(['admin', 'expert']), cropController.createCrop);
router.get('/', authMiddleware, rbacMiddleware(['admin', 'expert']), cropController.getCrops);
router.get('/:id', authMiddleware, rbacMiddleware(['admin', 'expert']), cropController.getCropById);
router.put('/:id', authMiddleware, rbacMiddleware(['admin', 'expert']), cropController.updateCrop);
router.delete('/:id', authMiddleware, rbacMiddleware(['admin', 'expert']), cropController.deleteCrop);

module.exports = router;
