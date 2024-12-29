const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const staff_controllers = require('../controllers/staff_controllers');

// router.use(protect(['staff']));

// quản lý khách hàng
router.post('/customer/add', staff_controllers.addCustomer);                // 1. thêm vào thông tin khách hàng
// router.get('/staff/customer/order/view', staff_controllers.viewOrder);   // 2. xem danh sách các order
router.post('/customer/order/create', staff_controllers.createOrder);       // 3. tạo order
router.post('/customer/order/confirm', staff_controllers.confirmOrder);     // 4. xác nhận order và xuất hóa đơn cho khách hàng
// router.post('/customer/order/delete', staff_controllers.deleteOrder);    // 5. xóa order

module.exports = router;