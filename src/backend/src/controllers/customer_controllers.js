const { sql, con } = require('../configs/dbConfig');

// 1. xem điểm của khách hàng
exports.viewCustomerPoints = async (req, res) => {
    const { phone_number } = req.body;

    if (!phone_number) {
        return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    try {
        const pool = await con;

        const result = await pool.request()
            .input('phone_number', sql.VarChar(10), phone_number)
            .execute('sp_view_customer_points');

        if (result.recordset.length > 0) {
            console.log(result.recordset);
            res.status(200).json({
                success: true,
                data: result.recordset,
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'No active membership found for the provided phone number.',
            });
        }
    } catch (error) {
        console.error('Error fetching customer points:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error.'
        });
    }
};

// 2. đặt trước
exports.reserveOrderByCustomer = async (req, res) => {
    const {
        type = 'reserve',
        user_id,
        branch_id,
        datetime,
        num_guests,
        items_json
    } = req.body;

    if (!user_id || !branch_id || !datetime || !num_guests || !items_json) {
        return res.status(400).json({
            success: false,
            error: 'Required fields are missing (user_id, branch_id, datetime, num_guests, items_json).',
        });
    }

    try {
        const pool = await con;
        const itemsJson = JSON.stringify(items_json);
        const result = await pool.request()
            .input('type', sql.VarChar(20), type)
            .input('user_id', sql.Int, user_id)
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('datetime', sql.DateTime, datetime)
            .input('num_guests', sql.Int, num_guests)
            .input('items_json', sql.NVarChar(sql.MAX), itemsJson)
            .execute('sp_reserve_and_delivery_order_by_customer');

        res.status(201).json({
            success: true,
            message: 'Reservation order placed successfully.',
        });
    } catch (error) {
        console.error('Error placing reservation order:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
};
// 3. đặt giao tận nơi
exports.deliveryOrderByCustomer = async (req, res) => {
    const {
        type = 'delivery',
        user_id,
        branch_id,
        address,
        items_json,
        datetime
    } = req.body;

    if (!user_id || !branch_id || !address || !items_json || !datetime) {
        return res.status(400).json({
            success: false,
            error: 'Required fields are missing (user_id, branch_id, datetime, address, items_json).',
        });
    }

    try {
        const pool = await con;
        const itemsJson = JSON.stringify(items_json);
        const result = await pool.request()
            .input('type', sql.VarChar(20), type)
            .input('user_id', sql.Int, user_id)
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('datetime', sql.DateTime, datetime)
            .input('address', sql.NVarChar(255), address)
            .input('items_json', sql.NVarChar(sql.MAX), itemsJson)
            .execute('sp_reserve_and_delivery_order_by_customer');

        res.status(201).json({
            success: true,
            message: 'Delivery order placed successfully.',
        });
    } catch (error) {
        console.error('Error placing delivery order:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
};