const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const staff_controllers = require('../controllers/staff_controllers');

// router.use(protect(['staff']));

// quản lý khách hàng
router.post('/customer/add', staff_controllers.addCustomer);                // 1. thêm vào thông tin khách hàng
router.post('/customer/order/confirm', staff_controllers.confirmOrder);     // 2. xác nhận order
router.post('/customer/order/create', staff_controllers.createOrder);       // 3. tạo order
router.post('/customer/order/delete', staff_controllers.deleteOrder);       // 4. xóa order
router.get('/customer/order/view', staff_controllers.viewOrder);            // 5. xem danh sách các order
router.post('/customer/export-bill', staff_controllers.exportBill);         // 6. xuất bill cho customer

module.exports = router;