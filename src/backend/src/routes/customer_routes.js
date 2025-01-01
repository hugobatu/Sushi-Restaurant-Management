const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const customerControllers = require('../controllers/customer_controllers');

// router.use(protect(['customer']));

router.post('/view-points', customerControllers.viewCustomerPoints);       // 1. xem hạng mức thành viên bằng SĐT
router.post('/reserve-order', customerControllers.reserveOrderByCustomer); // 2. đặt trước
router.post('/delivery-order', customerControllers.deliveryOrderByCustomer);// 3. đặt giao tận nơi

module.exports = router;