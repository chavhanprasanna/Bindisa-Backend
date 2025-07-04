const express = require('express');
const router = express.Router();
const farmingPlanController = require('../controllers/farming_plan.controller');
const { auth, authorize, ROLES } = require('../middleware/auth.middleware');

// Farmers can create plans for themselves; experts/admin can manage any
router.post('/', auth, farmingPlanController.createFarmingPlan);
router.get('/', auth, farmingPlanController.getFarmingPlans);
router.get('/:id', auth, farmingPlanController.getFarmingPlanById);
router.put('/:id', auth, farmingPlanController.updateFarmingPlan);
router.delete('/:id', auth, authorize(ROLES.ADMIN, ROLES.EXPERT), farmingPlanController.deleteFarmingPlan);

module.exports = router;
