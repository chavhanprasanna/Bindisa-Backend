const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');

router.post('/', authMiddleware, rbacMiddleware(['admin']), userController.createUser);
router.get('/', authMiddleware, rbacMiddleware(['admin']), userController.getUsers);
router.get('/:id', authMiddleware, rbacMiddleware(['admin']), userController.getUserById);
router.put('/:id', authMiddleware, rbacMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware, rbacMiddleware(['admin']), userController.deleteUser);

module.exports = router; 