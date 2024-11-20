const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');


const cors = require('cors')
const {test} = require('../controller/authController')

// middleware

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get('/', test)



// router.post('/signup', authController.signup);


// router.post('/login', authController.login);

module.exports = router;