const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const staff_controllers = require('../controllers/staff_controllers');

// router.use(protect(['staff']));

// quản lý khách hàng
router.post('/customer/add', staff_controllers.addCustomer);            // 1. thêm khách hàng
router.post('/customer/order/create', staff_controllers.createOrder);   // 2. tạo order
router.post('/customer/order/create', staff_controllers.createOrder);   // 3. xóa order

module.exports = router;
