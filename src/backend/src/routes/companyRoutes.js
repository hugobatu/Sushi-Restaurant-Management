const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// company routes
router.get('/branches', companyController.getBranches);
router.post('/branches', companyController.addBranch);
router.get('/branches/:id', companyController.getBranchById);
router.put('/branches/:id', companyController.updateBranch);
router.delete('/branches/:id', companyController.deleteBranch);
// staff management
router.get('/staff', companyController.getStaff);
router.post('/staff', companyController.addStaff);
router.get('/staff/:id', companyController.getStaffById);
router.put('/staff/:id', companyController.updateStaff);
router.delete('/staff/:id', companyController.deleteStaff);

module.exports = router;