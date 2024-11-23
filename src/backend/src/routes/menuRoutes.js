const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');


// Menu Routes
router.get('/:branchId', menuController.getMenuByBranch);
router.post('/:branchId', menuController.addMenuItem);
router.put('/:branchId/:itemId', menuController.updateMenuItem);
router.delete('/:branchId/:itemId', menuController.deleteMenuItem);

router.post('/:branchId/categories', menuController.addMenuCategory);
router.put('/:branchId/categories/:categoryId', menuController.updateMenuCategory);
router.delete('/:branchId/categories/:categoryId', menuController.deleteMenuCategory);

router.post('/:branchId/combos', menuController.addCombo);
router.put('/:branchId/combos/:comboId', menuController.updateCombo);
router.delete('/:branchId/combos/:comboId', menuController.deleteCombo);

module.exports = router;
