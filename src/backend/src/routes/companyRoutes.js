const express = require('express');
const {protect} = require('../../middlewares/authMiddleware');
const companyController = require('../controllers/companyController');

const router = express.Router();

router.use(protect(['admin']));

// xem danh sách các chi nhánh đang hoạt động
router.get
// thêm chi nhánh
router.post('/branch', companyController.addBranch);
// xóa chi nhánh
router.delete('/branch', companyController.deleteBranch);
// chỉnh sửa thông tin của chi nhánh
router.get('/branch', companyController.updateBranch);
// 