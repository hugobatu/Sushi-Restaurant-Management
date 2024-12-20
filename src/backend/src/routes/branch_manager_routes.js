const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const controllers = require('../controllers/branch_manager_controllers');

// router.use(protect(['manager']));

// xem danh sách nhân viên
router.get('/manager/staff/name', controllers.getStaffDataByName); // 9. xem nhân viên theo tên
router.get('/manager/staff/all-data', controllers.getAllBranchStaffData); // 10. xem tất cả nhân viên theo chi nhánh
router.get('/manager/staff/ratings', controllers.getBranchStaffRatings); // 11. xem tất cả đánh giá của nhân viên tại chi nhánh đó
router.get('/manager/branch-sales', controllers.getBranchSales); // 12. xem doanh thu của chi nhánh đó

// menu của chi nhánh
router.post('/menu-branch-item/add', controllers.addBranchMenuItem); // 1. thêm branch menu item vào chi nhánh
router.delete('/menu-branch-item/delete', controllers.deleteBranchMenuItem); // 2. xóa branch menu item ra khỏi chi nhánh
router.put('/menu-branch-item/change-status', controllers.changeBranchMenuItem); // 3. chỉnh sửa trạng thái menu chi nhánh

// quản lý món ăn (chung của cả hệ thống)
router.post('/menu-item/add', controllers.addMenuItem); // 4. thêm món ăn vào hệ thống
router.delete('/menu-item/add', controllers.deleteMenuItem); // 5. xóa món ăn ra khỏi hệ thống

// thêm combo cho hệ thống
router.post('/combo/add', controllers.addCombo); // 6. thêm combo vào hệ thống
router.delete('/combo/delete', controllers.deleteCombo); // 7. xóa combo ra khỏi hệ thống

// quản lý khách hàng
router.post('/manager/customer/add', controllers.addCustomer); // 8. thêm khách hàng

// xem danh sách nhân viên
router.get('/manager/staff/name', controllers.getStaffDataByName); // 9. xem nhân viên theo tên
router.get('/manager/staff/all-data', controllers.getAllBranchStaffData); // 10. xem tất cả nhân viên theo chi nhánh
router.get('/manager/staff/ratings', controllers.getBranchStaffRatings); // 11. xem đánh giá nvien của cnhanh manager đang qly 
router.get('/manager/branch-sales', controllers.getBranchSales); // 12. xem doanh thu của chi nhánh mà manager đang quản lý

module.exports = router;