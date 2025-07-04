const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, authorize, ROLES } = require('../middleware/auth.middleware');

router.post('/', auth, authorize(ROLES.ADMIN), userController.createUser);
router.get('/', auth, authorize(ROLES.ADMIN), userController.getUsers);
router.get('/:id', auth, authorize(ROLES.ADMIN), userController.getUserById);
router.put('/:id', auth, authorize(ROLES.ADMIN), userController.updateUser);
router.delete('/:id', auth, authorize(ROLES.ADMIN), userController.deleteUser);

module.exports = router; 