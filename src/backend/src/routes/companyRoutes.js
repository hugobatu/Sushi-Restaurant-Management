const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const companyController = require('../controllers/companyController');

// router.use(protect(['admin']));

// Quản lý khu vực
router.post('/region/add', companyController.addRegion);            // 1. thêm khu vực

// Quản lý chi nhánh
router.post('/branch/add', companyController.addBranch);            // 2. thêm chi nhánh
router.put('/branch/update', companyController.updateBranch);       // 3. cập nhật thông tin chi nhánh
router.get('/branch/getBranches', companyController.getBranches);               // 4. lấy danh sách các chi nhánh


// // Quản lý nhân viên
router.post('/staff/add', companyController.addStaff);              // 5. thêm nhân viên
router.put('/staff/fire', companyController.fireStaff);              // 6. Sa thải nhân viên
router.put('/staff/update', companyController.updateStaffSalary);         // 7. tăng lương nhân viên
router.get('/staff/transfer', companyController.transferStaff);              // 8. chuyển nhân viên sang chi nhánh khác

// lam tu 1 toi 8 truoc

router.put('/staff/getdata', companyController.getStaffByName);            // 9. tìm nhân viên dựa theo tên (có thể có nhiều kết quả)

// // Doanh thu và đánh giá
router.get('/ratings/branches', companyController.getBranchRating); // 10. xem đánh giá chi nhánh
router.get('/ratings/staffs', companyController.getStaffRating);    // 11. xem đánh giá nhân viên
router.get('/sales', companyController.getSales);                   // 12. xem doanh thu theo tháng, quý, năm
router.get('/itemsales', companyController.getItemSalesStats);      // 13. xem thống kê số lượng món ăn bán ra được

module.exports = router;