const { sql, con } = require('../configs/dbConfig');  // db connection

// 1. thêm khách hàng
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

// 2. xem danh sách các order (của nhân viên phụ trách + reserve và delivery)
exports.viewOrder = async (req, res) => {
    const {
        user_id,
        order_status = 'pending'
    } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const pool = await con;

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('order_status', sql.NVarChar(20), order_status)
            .execute('sp_view_order_by_userid');

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json({
                success: true,
                order: result.recordset,
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'There is no order now.',
            });
        }
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Error while viewing order',
            message: error.message
        });
    }
};
// 3. tạo order ăn trực tiếp
exports.createOrder = async (req, res) => {
    const {
        user_id, // ID của nhân viên tạo đơn
        customer_name,
        phone_number,
        table_id,
        items // Mảng các món ăn [{ item_id: 'item1', quantity: 2 }, { item_id: 'item2', quantity: 1 }]
    } = req.body;

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
// 4. confirm hóa đơn ăn trực tiếp
exports.confirmDirectOrder = async (req, res) => {
    const {
        user_id,
        order_id,
        vat = 0.08,
        servile_manner_rating,
        branch_rating,
        food_quality_rating,
        price_rating,
        surroundings_rating,
        personal_response,
    } = req.body;
    if (!user_id || !order_id) {
        return res.status(400).json({
            success: false,
            error: 'User ID and Order ID are required.',
        });
    }
    try {
        const pool = await con;
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('order_id', sql.Int, order_id)
            .input('vat', sql.Float, vat)
            .input('servile_manner_rating', sql.Int, servile_manner_rating)
            .input('branch_rating', sql.Int, branch_rating)
            .input('food_quality_rating', sql.Int, food_quality_rating)
            .input('price_rating', sql.Int, price_rating)
            .input('surroundings_rating', sql.Int, surroundings_rating)
            .input('personal_response', sql.NVarChar(255), personal_response)
            .execute('sp_confirm_direct_service_order');

        // Kiểm tra kết quả trả về
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            console.log(result.recordset)
            return res.status(201).json({
                success: true,
                message: 'Confirm direct order successfully.',
                bill: result.recordset,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Fail to confirm direct order, nothing is confirmed.',
            });
        }
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Error confirming direct order',
            message: error.message,
        });
    }
}
// 5. xác nhận delivery và reserve
exports.confirmDeliveryReserve = async (req, res) => {
    const {
        order_id,
        vat = 0.08
    } = req.body;
    if (!order_id) {
        return res.status(400).json({
            success: false,
            error: 'Order ID is required.',
        });
    }
    try {
        const pool = await con;

        const result = await pool.request()
            .input('order_id', sql.Int(), order_id)
            .input('vat', sql.Float, vat)
            .execute(`sp_confirm_reserve_and_delivery_order`);
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            console.log(result.recordset);
            return res.status(201).json({
                success: true,
                message: 'Confirm delivery order/reserve order with successfully.',
                bill: result.recordset,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Fail to confirm delivery order/reserve order, nothing is confirmed.',
            });
        }
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Error confirming delivery order/reserve order',
            message: error.message,
        });
    }
}

// 6. xóa order
exports.deleteOrder = async (req, res) => {
    const {
        order_id
    } = req.body;
    if (!order_id) {
        return res.status(400).json({
            success: false,
            error: 'Order ID is required.',
        });
    }
    try {
        const pool = await con;

        const result = await pool.request()
            .input('order_id', sql.Int, order_id)
            .execute(`sp_delete_order`);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({
                success: true,
                message: `Order with ID ${order_id} deleted successfully.`,
            });
        } else {
            res.status(404).json({
                success: false,
                error: `Order with ID ${order_id} not found.`,
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting order',
        });
    }
}