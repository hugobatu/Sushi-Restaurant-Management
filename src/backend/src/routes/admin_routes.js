const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const admin_controllers = require('../controllers/admin_controllers');

// router.use(protect(['admin']));

// Quản lý khu vực
router.post('/region/add', admin_controllers.addRegion);            // 1. thêm khu vực

// Quản lý chi nhánh
router.post('/branch/add', admin_controllers.addBranch);            // 2. thêm chi nhánh
router.put('/branch/update', admin_controllers.updateBranch);       // 3. cập nhật thông tin chi nhánh
router.get('/branch', admin_controllers.getBranches);               // 4. lấy danh sách các chi nhánh


// // Quản lý nhân viên
router.post('/staff/add', admin_controllers.addStaff);              // 5. thêm nhân viên
router.put('/staff/fire', admin_controllers.fireStaff);             // 6. Sa thải nhân viên
router.put('/staff/update', admin_controllers.updateStaffSalary);   // 7. tăng lương nhân viên
router.put('/staff/transfer', admin_controllers.transferStaff);     // 8. chuyển nhân viên sang chi nhánh khác
router.get('/staff/getstaffdata', admin_controllers.getStaffData);// 9. tìm nhân viên dựa theo tên (có thể có nhiều kết quả)

// // Doanh thu và đánh giá
router.get('/ratings/branches', admin_controllers.getBranchRating); // 10. xem đánh giá chi nhánh
router.get('/ratings/staffs', admin_controllers.getStaffRating);    // 11. xem đánh giá nhân viên
router.get('/branchsales', admin_controllers.getSales);             // 12. xem doanh thu theo tháng, quý, năm
router.get('/itemsales', admin_controllers.getItemSalesStats);      // 13. xem thống kê số lượng món ăn bán ra được

module.exports = router;