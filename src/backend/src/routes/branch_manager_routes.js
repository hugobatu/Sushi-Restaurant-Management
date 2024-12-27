const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const controllers = require('../controllers/branch_manager_controllers');

// router.use(protect(['manager']));

// menu của chi nhánh
router.post('/menu-branch-item/add', controllers.addBranchMenuItem); // 1. thêm branch menu item vào chi nhánh
router.delete('/menu-branch-item/delete', controllers.deleteBranchMenuItem); // 2. xóa branch menu item ra khỏi chi nhánh
router.put('/menu-branch-item/change-status', controllers.changeBranchMenuItem); // 3. chỉnh sửa trạng thái menu chi nhánh

// xem danh sách nhân viên
router.get('/manager/staff/name', controllers.getStaffDataByName); // 4. xem nhân viên theo tên
router.get('/manager/staff/all-data', controllers.getAllBranchStaffData); // 5. xem tất cả nhân viên theo chi nhánh
router.get('/manager/staff/ratings', controllers.getBranchStaffRatings); // 6. xem đánh giá nvien của cnhanh manager đang qly 
router.get('/manager/branch-sales', controllers.getBranchSales); // 7. xem doanh thu của chi nhánh mà manager đang quản lý

module.exports = router;