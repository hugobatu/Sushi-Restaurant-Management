const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const manager_controllers = require('../controllers/branch_manager_controllers');

//router.use(protect(['manager']));

// menu của chi nhánh
router.post('/menu-branch-item/add', manager_controllers.addBranchMenuItem); // 1. thêm branch menu item vào chi nhánh
router.delete('/menu-branch-item/delete', manager_controllers.deleteBranchMenuItem); // 2. xóa branch menu item ra khỏi chi nhánh
router.put('/menu-branch-item/change-status', manager_controllers.changeBranchMenuItem); // 3. chỉnh sửa trạng thái menu chi nhánh
router.get('/menu-branch-item', manager_controllers.getBranchMenuItem); // *. lấy danh sách các menu chi nhánh

// xem danh sách nhân viên
router.post('/staff/name', manager_controllers.getStaffDataByName); // 4. xem nhân viên theo tên
router.post('/staff/all-data', manager_controllers.getAllBranchStaffData); // 5. xem tất cả nhân viên theo chi nhánh
router.get('/staff/ratings', manager_controllers.getBranchStaffRatings); // 6. xem đánh giá nvien của cnhanh manager đang qly

// xem doanh thu
router.get('/branch-sales', manager_controllers.getBranchSales); // 7. xem doanh thu của chi nhánh mà manager đang quản lý

module.exports = router;