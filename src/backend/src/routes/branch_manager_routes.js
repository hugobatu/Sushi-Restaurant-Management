const express = require('express');
const router = express.Router();
const branch_manager_controllers = require('../controllers/branch_manager_controllers');

// get staff info
router.get('/:id/staff', branch_manager_controllers.getBranchStaff);
router.post('/:id/staff', branch_manager_controllers.addBranchStaff);
router.put('/:id/staff/:staffId', branch_manager_controllers.updateBranchStaff);
router.delete('/:id/staff/:staffId', branch_manager_controllers.deleteBranchStaff);
// get info of table
router.get('/:id/tables', branch_manager_controllers.getBranchTables);
router.put('/:id/tables/:tableId', branch_manager_controllers.updateTableStatus);
// order
router.get('/:id/orders', branch_manager_controllers.getOrders);
router.post('/:id/orders', branch_manager_controllers.createOrder);
router.put('/:id/orders/:orderId', branch_manager_controllers.updateOrder);
router.delete('/:id/orders/:orderId', branch_manager_controllers.deleteOrder);

module.exports = router;