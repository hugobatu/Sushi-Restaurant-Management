const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const authController = require('./src/controllers/auth_controllers');
const admin_routes = require('./src/routes/admin_routes'); //admin
const manager_routes = require('./src/routes/branch_manager_routes'); // quan ly chi nhanh (branch manager)
const customer_routes = require('./src/routes/customer_routes'); // khach hang
const staff_routes = require('./src/routes/staff_routes'); // staff
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
app.use('/company', admin_routes); // Admin API
app.use('/manager', manager_routes); // Manager API
app.use('/staff', staff_routes); // Staff API
app.use('/manager', manager_routes); // Manager API
app.use('/customer', customer_routes); // Customer API

// Server Initialization
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});