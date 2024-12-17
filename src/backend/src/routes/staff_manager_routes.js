const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// customer routes
router.get('/', customerController.getAllCustomers);
router.post('/', customerController.addCustomer);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

router.get('/:id/feedbacks', customerController.getCustomerFeedbacks);
router.post('/:id/feedbacks', customerController.addCustomerFeedback);

module.exports = router;
