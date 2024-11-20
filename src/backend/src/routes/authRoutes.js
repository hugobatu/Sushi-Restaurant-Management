const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// route cho đăng ký (signup)
router.post('/signup', authController.signup);

// route cho đăng nhập (login)
router.post('/login', authController.login);

module.exports = router;