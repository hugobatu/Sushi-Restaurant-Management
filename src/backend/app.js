const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const authController = require('./src/controllers/authController');
const companyRoutes = require('./src/routes/companyRoutes');

const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies or credentials if needed
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/signup', authController.signup);
app.post('/login', authController.login);
app.use('/company', companyRoutes); // Company API

// Server Initialization
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



// const express = require('express');
// const dotenv = require('dotenv').config();
// const fs = require('fs')
// const path = require('path');
// const cors = require('cors');

// const authController = require('./src/controllers/authController');
// const authRoutes = require('./src/routes/authRoutes');
// const menuRoutes = require('./src/routes/menuRoutes');
// const companyRoutes = require('./src/routes/companyRoutes');

// const app = express();

// // Middleware
// // app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // // Static files
// // app.use(express.static(path.join(__dirname, 'src/public')));


// // app.use('/auth', authRoutes);
// // app.use('/api/menu', menuRoutes);
// app.use('/company', companyRoutes); // company api


// app.post('/signup', authController.signup);
// app.post('/login', authController.login);

// const port = process.env.PORT || 8000;

// app.listen(port, () => {
//     console.log(Server running on http://localhost:${port});
// });