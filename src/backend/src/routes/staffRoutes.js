const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Staff Routes
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.get('/:id/evaluations', staffController.getStaffEvaluations);

module.exports = router;