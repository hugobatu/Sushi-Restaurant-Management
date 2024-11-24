const express = require('express');
const router = express.Router();
// const { protect } = require('../../middlewares/authMiddleware');
const companyController = require('../controllers/companyController');

// router.use(protect(['admin']));

// Quản lý chi nhánh
router.get('/branch', companyController.getBranches);           // 2.4 Xem danh sách chi nhánh
router.post('/branch/add', companyController.addBranch);              // 2.1 Thêm chi nhánh
router.delete('/branch/delete/:branch_id', companyController.deleteBranch);     // 2.2 Xóa chi nhánh
router.put('/branch/update/:branch_id', companyController.updateBranch);        // 2.3 Cập nhật thông tin chi nhánh

// Quản lý khu vực
router.post('/region/add', companyController.addRegion);              // 2.5 Thêm khu vực
router.delete('/region/delete/:region_id', companyController.deleteRegion);     // 2.6 Xóa khu vực

// Quản lý nhân viên
router.post('/staff', companyController.addStaff);                // 2.7 Thêm nhân viên
router.delete('/staff/:id', companyController.deleteStaff);       // 2.8 Sa thải nhân viên
router.put('/staff/:id', companyController.updateStaff);          // 2.9 Cập nhật thông tin nhân viên
router.get('/staffs', companyController.getStaff);               // 2.11 Xem danh sách nhân viên

// Doanh thu và đánh giá
router.get('/sales', companyController.getSales);                 // 2.12 Xem doanh thu
router.get('/ratings/branches', companyController.getBranchRating); // 2.13 Đánh giá chi nhánh
router.get('/ratings/staffs', companyController.getStaffRating); // 2.14 Đánh giá nhân viên

module.exports = router;