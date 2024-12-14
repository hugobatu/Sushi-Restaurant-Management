const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { con, sql } = require('../configs/dbConfig');
const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw new Error('Failed to load .env file');
}

exports.signup = async (req, res) => {
    const {
        username,
        password,
        email,
        phone_number,
        name,
        gender,
        id_number,
        birth_date,
    } = req.body;
    const role = 'customer';

    if (!username || !password || (!email && !phone_number)) {
        return res.status(400).json({ message: 'Please provide required fields.' });
    }

    try {
        const pool = await con;

        // check if customer already exists
        const customerQuery = `
            SELECT * FROM Customer
            WHERE email = @email OR phone_number = @phone_number OR id_number = @id_number`;
        const customerResult = await pool.request()
            .input('email', sql.VarChar(50), email)
            .input('phone_number', sql.VarChar(10), phone_number)
            .input('id_number', sql.VarChar(12), id_number)
            .query(customerQuery);

        const isExistingCustomer = customerResult.recordset.length > 0;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (isExistingCustomer) {
            const customer = customerResult.recordset[0];
            // check if customer already has an account linked
            if (customer.username != null) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Customer already has an account.'
                });
            }
            // link account to the existing customer
            const result = await pool.request()
                .input('username', sql.VarChar(50), username)
                .input('password', sql.NVarChar, hashedPassword)
                .input('role', sql.NVarChar(20), role)
                .input('status', sql.NVarChar(20), 'active')
                .input('customer_id', sql.Int, customer.customer_id) // Use unique identifier
                .query(`
                    INSERT INTO Account (username, password, account_type, account_status)
                    VALUES (@username, @password, @role, @status)

                    UPDATE Customer
                    SET username = @username
                    WHERE customer_id = @customer_id
                `);

            return res.status(201).json({
                success: true,
                username: username, 
                message: 'Account created and linked to existing customer.',
                result: result
            });
        } else {
            const customer = await pool.request()
                .input('email', sql.NVarChar(50), email)
                .input('phone_number', sql.NVarChar(15), phone_number)
                .input('name', sql.NVarChar(50), name)
                .input('gender', sql.NVarChar(10), gender)
                .input('id_number', sql.VarChar(20), id_number)
                .input('birth_date', sql.Date, birth_date)
                .query(`
                    INSERT INTO Customer (email, phone_number, customer_name, gender, id_number, birth_date)
                    OUTPUT Inserted.customer_id
                    VALUES (@email, @phone_number, @name, @gender, @id_number, @birth_date)
                `);

            const customerId = customer.recordset[0].customer_id;
                        
            // create a new account linked to the customer
            const result = await pool.request()
                .input('username', sql.VarChar(50), username)
                .input('password', sql.NVarChar, hashedPassword)
                .input('role', sql.NVarChar(20), role)
                .input('status', sql.NVarChar(20), 'active')
                .input('customer_id', sql.Int, customerId)
                .query(`
                    INSERT INTO Account (username, password, account_type, account_status)
                    VALUES (@username, @password, @role, @status)

                    UPDATE Customer
                    SET username = @username
                    WHERE customer_id = @customer_id
                `);
            
            return res.status(201).json({
                success: true,
                username: username,
                password: hashedPassword,
                message: 'New customer and account created successfully.',
                result: result
            });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during signup.',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password.' });
    }

    try {
        const pool = await con;
        
        // Fetch user from the database
        const result = await pool.request()
            .input('username', sql.VarChar(50), username)
            .query('SELECT * FROM Account WHERE username = @username');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const account = result.recordset[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: account.username, role: account.account_type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token, message: 'Login successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};