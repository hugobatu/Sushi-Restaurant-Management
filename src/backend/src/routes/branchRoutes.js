const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// get staff info
router.get('/:id/staff', branchController.getBranchStaff);
router.post('/:id/staff', branchController.addBranchStaff);
router.put('/:id/staff/:staffId', branchController.updateBranchStaff);
router.delete('/:id/staff/:staffId', branchController.deleteBranchStaff);
// get info of table
router.get('/:id/tables', branchController.getBranchTables);
router.put('/:id/tables/:tableId', branchController.updateTableStatus);
// order
router.get('/:id/orders', branchController.getOrders);
router.post('/:id/orders', branchController.createOrder);
router.put('/:id/orders/:orderId', branchController.updateOrder);
router.delete('/:id/orders/:orderId', branchController.deleteOrder);

module.exports = router;