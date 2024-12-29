const { sql, con } = require('../configs/dbConfig');  // db connection

// 1.
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
// 2. view order
// exports.viewOrder = async(req, res) => {
//     const
// }
// 3.
exports.createOrder = async (req, res) => {
    const {
        user_id, // ID của nhân viên tạo đơn
        customer_name,
        phone_number,
        table_id,
        items // Mảng các món ăn [{ item_id: 'item1', quantity: 2 }, { item_id: 'item2', quantity: 1 }]
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!user_id || !customer_name || !phone_number || !table_id || !items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields or items array is empty.'
        });
    }

    try {
        const pool = await con; // Kết nối với cơ sở dữ liệu

        // Tạo chuỗi JSON để truyền vào SQL Server
        const itemsJson = JSON.stringify(items);

        // Thực hiện gọi Stored Procedure với dữ liệu JSON
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('customer_name', sql.NVarChar(50), customer_name)
            .input('phone_number', sql.VarChar(10), phone_number)
            .input('items_json', sql.NVarChar(sql.MAX), itemsJson) // Truyền JSON dưới dạng chuỗi
            .input('table_id', sql.Int, table_id)
            .query(`EXEC sp_create_order_by_staff @user_id, @customer_name, @phone_number, @table_id, @items_json`);

        // Kiểm tra kết quả trả về
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            console.log(itemsJson)
            console.log(result)
            return res.status(201).json({
                success: true,
                message: 'Order created successfully.',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Order creation failed: No rows affected.',
            });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order.',
            error: error.message
        });
    }
};
// 4. confirm order
exports.confirmOrder = async (req, res) => {
    const {
        user_id,

    } = req.body;
}