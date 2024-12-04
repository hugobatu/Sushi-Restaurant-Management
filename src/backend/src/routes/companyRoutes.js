const express = require('express');
const router = express.Router();
// const { protect } = require('../../middlewares/authMiddleware');
const companyController = require('../controllers/companyController');

// router.use(protect(['admin']));

// Quản lý chi nhánh
router.get('/branch', companyController.getBranches);           // 1 Xem danh sách chi nhánh
// router.post('/branch/add', companyController.addBranch);              // 2 Thêm chi nhánh
// router.delete('/branch/delete/:branch_id', companyController.deleteBranch);     // 3 Xóa chi nhánh
// router.put('/branch/update/:branch_id', companyController.updateBranch);        // 4 Cập nhật thông tin chi nhánh

// // Quản lý khu vực
// router.post('/region/add', companyController.addRegion);              // 5 Thêm khu vực
// router.delete('/region/delete/:region_id', companyController.deleteRegion);     // 6 Xóa khu vực

// // Quản lý nhân viên
// router.get('/staff', companyController.getStaff);               // 7 Xem danh sách nhân viên
// router.post('/staff/add', companyController.addStaff);                // 8 Thêm nhân viên
// router.delete('/staff/:id', companyController.deleteStaff);       // 9 Sa thải nhân viên
// router.put('/staff/:id', companyController.updateStaff);          // 10 Cập nhật thông tin nhân viên

// // Doanh thu và đánh giá
// router.get('/sales', companyController.getSales);                 // 11 Xem doanh thu
// router.get('/ratings/branches', companyController.getBranchRating); // 12 Đánh giá chi nhánh
// router.get('/ratings/staffs', companyController.getStaffRating); // 13 Đánh giá nhân viên

module.exports = router;