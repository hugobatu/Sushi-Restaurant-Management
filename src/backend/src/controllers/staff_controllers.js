const { sql, con } = require('../configs/dbConfig');  // db connection

exports.addCustomer = async (req, res) => {
    const {
        customer_name,
        email,
        phone_number,
        gender,
        birth_date,
        id_number
    } = req.body;

    // Validate required fields
    if (!customer_name || !email || !phone_number || !gender || !birth_date || !id_number) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields. Please provide all customer details.",
        });
    }
    
    try {
        const pool = await con;

        // Execute the stored procedure
        await pool.request()
            .input('customer_name', sql.NVarChar(50), customer_name)
            .input('email', sql.VarChar(50), email)
            .input('phone_number', sql.VarChar(10), phone_number)
            .input('gender', sql.NVarChar(10), gender)
            .input('birth_date', sql.Date, birth_date)
            .input('id_number', sql.VarChar(12), id_number)
            .execute('sp_add_customer_info');

        return res.status(201).json({
            success: true,
            message: "Customer added successfully.",
        });
    } catch (error) {
        console.error("Error adding customer:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the customer.",
            error: error.message,
        });
    }
};