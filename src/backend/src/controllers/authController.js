const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const pool = require('../configs/dbConfig'); // Import the pool from dbConfig.js

// Signup function
exports.signup = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Please provide username, password, and role.' });
    }

    try {
        // Check if user already exists
        const [rows] = await pool.query(
            'SELECT * FROM Account WHERE username = ?',
            [username]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await pool.query(
            'INSERT INTO Account (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password.' });
    }

    try {
        // Fetch user from the database
        const [rows] = await pool.query(
            'SELECT * FROM Account WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const account = rows[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: account.id, role: account.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token, message: 'Login successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Test route for middleware
exports.test = (req, res) => {
    res.send('AuthController Test Route');
};
