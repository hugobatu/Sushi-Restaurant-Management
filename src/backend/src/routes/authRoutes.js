// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');


// const cors = require('cors')
// const {test} = require('../controllers/authController')

// // middleware

// router.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:5173'
//     })
// )

// router.get('/', test)



// // router.post('/signup', authController.signup);


// // router.post('/login', authController.login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;