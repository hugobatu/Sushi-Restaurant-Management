const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const staff_controllers = require('../controllers/staff_controllers');

// router.use(protect(['staff']));

// quản lý khách hàng
router.post('/customer/add', staff_controllers.addCustomer);                            // 1. thêm vào thông tin khách hàng
router.get('/customer/order/view', staff_controllers.viewOrder);                        // 2. xem danh sách các order
router.post('/customer/order/create', staff_controllers.createOrder);                   // 3. tạo order ăn trực tiếp (bởi staff)
router.post('/customer/order/confirm-direct', staff_controllers.confirmDirectOrder);    // 4. xác nhận order ăn trực tiếp + xuất hóa đơn
// 5. xác nhận order reserve + delivery
router.post('/customer/order/confirm-reserve-delivery', staff_controllers.confirmDeliveryReserve) 
router.delete('/customer/order/delete', staff_controllers.deleteOrder);                   // 6. xóa order

module.exports = router;