const { MAX } = require('mssql');
const { con, sql } = require('../configs/dbConfig');
const { hashPassword } = require('../utils/accountService');
const { formatBirthDate } = require('../utils/stringUtils');
const { reset } = require('nodemon');

// 1.
exports.addRegion = async (req, res) => {
    const {
        region_name
    } = req.body;
    try {
        const pool = await con;
        const result = await pool.request()
            .input('region_name', sql.NVarChar(50), region_name)
            .query(`EXEC sp_add_region @region_name`);
        return res.status(200).json({
            success: true,
            message: "Insert new region successfully",
            result: result,
        });
    } catch (error) {
        console.error("Error inserting new region:", error);
        res.status(500).json({
            success: false,
            message: "Error inserting new region",
            result: error.message,
        });
    }
};

// 2.
exports.addBranch = async (req, res) => {
    const {
        region_id,
        branch_name,
        branch_address,
        opening_time,
        closing_time,
        phone_number,
        has_bike_parking_lot,
        has_car_parking_lot,
    } = req.body;
    console.log(req.body);
    if (!region_id || !branch_name || !phone_number || !opening_time || !closing_time) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: region_id, branch_name, or phone_number."
        });
    }
    if (phone_number.length !== 10 || isNaN(phone_number)) {
        return res.status(400).json({
            success: false,
            message: "Invalid phone number. Must be a 10-digit number."
        });
    }
    try {
        const pool = await con;
        const result = await pool.request()
            .input('region_id', sql.VarChar(10), region_id)
            .input('branch_name', sql.NVarChar(50), branch_name)
            .input('branch_address', sql.NVarChar(50), branch_address)
            .input('opening_time', sql.NVarChar(10), opening_time)
            .input('closing_time', sql.NVarChar(10), closing_time)
            .input('phone_number', sql.VarChar(10), phone_number)
            .input('has_bike_parking_lot', sql.Bit, has_bike_parking_lot)
            .input('has_car_parking_lot', sql.Bit, has_car_parking_lot)
            .query(`EXEC sp_add_new_branch @region_id, @branch_name, @branch_address, 
                @opening_time, @closing_time, @phone_number, @has_bike_parking_lot, @has_car_parking_lot`);

        res.status(200).json({
            success: true,
            message: "Branch added successfully",
            result: result,
        });
    } catch (error) {
        console.error("Error inserting branch:", error);
        res.status(500).json({
            success: false,
            message: "Error adding branch",
            error: error.message,
        });
    }
};
// 3.
exports.updateBranch = async (req, res) => {
    const {
        branch_id,
        new_status,
        has_bike_parking_lot = 0,
        has_car_parking_lot = 0,
    } = req.body;
    try {
        if (new_status != 'working' && new_status != 'closed' && new_status != 'maintenance') {
            return res.status(500).json({
                success: false,
                message: "New status must be 'working' or 'closed' or 'maintenance'",
            });
        }
        const pool = await con;
        const result = await pool.request()
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('new_status', sql.NVarChar(50), new_status)
            .input('has_bike_parking_lot', sql.Bit, has_bike_parking_lot)
            .input('has_car_parking_lot', sql.Bit, has_car_parking_lot)
            .query(`EXEC sp_update_branch_status @branch_id, @new_status, @has_bike_parking_lot, @has_car_parking_lot`);

        return res.status(200).json({
            success: true,
            message: "Update branch info successfully",
            result: result,
        });
    } catch (error) {
        console.error("Error updating branch:", error);
        res.status(500).json({
            success: false,
            message: "Error updating branch",
            error: error.message,
        });
    }
}
// 4.
exports.getBranches = async (req, res) => {
    const { page_number = 1, page_size = 5 } = req.body; // Default values
    try {
        const pool = await con;
        const result = await pool.request()
            .input('page_number', sql.Int, page_number)
            .input('page_size', sql.Int, page_size)
            .query('EXEC sp_get_branches_data @page_number, @page_size');
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No branches found',
            });
        }
        res.status(200).json({
            success: true,
            data: result.recordset,
            pagination: {
                page: page_number,
                size: page_size,
            },
        });
    } catch (error) {
        console.error('Error fetching branches data', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching branches data',
            error: error.message,
        });
    }
};

// 5.
exports.addStaff = async (req, res) => {
    const {
        branch_id,
        department_name,
        staff_name,
        birth_date,
        phone_number,
        gender,
    } = req.body;

    // Validate required fields
    if (!branch_id || !department_name || !staff_name || !birth_date || !phone_number || !gender) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    // Validate phone number
    if (phone_number.length !== 10 || isNaN(phone_number)) {
        return res.status(400).json({
            success: false,
            message: "Invalid phone number. Must be a 10-digit number.",
        });
    }

    // Validate birth date (basic example)
    if (isNaN(Date.parse(birth_date)) || new Date(birth_date) > new Date()) {
        return res.status(400).json({
            success: false,
            message: "Invalid birth date. Ensure it's a valid in the past date.",
        });
    }

    const pool = await con;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = transaction.request();

        // 1. Validate Department Exists
        const departmentResult = await request
            .input("branch_id", sql.VarChar(10), branch_id)
            .input("department_name", sql.NVarChar(50), department_name)
            .query(`
                SELECT department_id, base_salary
                FROM Department
                WHERE department_name = @department_name AND branch_id = @branch_id;
            `);

        if (departmentResult.recordset.length === 0) {
            throw new Error("No department or branch found.");
        }

        const { department_id, base_salary } = departmentResult.recordset[0];

        // 2. Check Phone Number Exists
        const phoneCheck = await request
            .input("phone_number", sql.VarChar(10), phone_number)
            .query(`
                SELECT 1
                FROM Staff
                WHERE phone_number = @phone_number;
            `);

        if (phoneCheck.recordset.length > 0) {
            throw new Error("This staff already exists (based on phone number lookup).");
        }

        // 3. Check for Manager Constraints
        const account_type = department_name.toLowerCase();
        if (account_type === "manager") {
            const managerCheck = await request
                .input("branch_id", sql.VarChar(10), branch_id)
                .query(`
                    SELECT 1
                    FROM Staff S
                    JOIN Department D ON S.department_id = D.department_id
                    WHERE D.department_name = 'manager' AND D.branch_id = @branch_id;
                `);

            if (managerCheck.recordset.length > 0) {
                throw new Error("Each branch can only have one manager.");
            }
        }

        if (account_type != 'security' && account_type != 'chef') {
            const formatted_birth_date = await formatBirthDate(birth_date);
            const hashedPassword = await hashPassword(formatted_birth_date); // format dob from yyyy-mm-dd to dd-mm-yyyy

            // 4. Insert into Account
            await request
                .input('password', sql.NVarChar(MAX), hashedPassword)
                .input('account_type', sql.NVarChar(20), account_type)
                .query(`
                INSERT INTO Account (username, [password], account_type, account_status, day_created)
                VALUES (@phone_number, @password, @account_type, 'active', GETDATE());
            `);

            // 5. Insert into Staff
            const staffInsert = await request
                .input('department_id', sql.Int, department_id)
                .input('staff_name', sql.NVarChar(50), staff_name.toUpperCase())
                .input('birth_date', sql.Date, birth_date)
                .input('gender', sql.NVarChar(10), gender.toLowerCase())
                .input('salary', sql.Float, base_salary)
                .query(`
            INSERT INTO Staff (department_id, staff_name, birth_date, phone_number ,gender, salary, join_date, staff_status, username)
            OUTPUT Inserted.staff_id
            VALUES (@department_id, @staff_name, @birth_date, @phone_number, @gender, @salary, GETDATE(), 'active', @phone_number);
        `);

            const newStaffId = staffInsert.recordset[0].staff_id;
            // 6. Insert into WorkHistory
            await request
                .input('staff_id', sql.Int, newStaffId)
                .query(`
                        INSERT INTO WorkHistory (staff_id, department_id, starting_date)
                        VALUES (@staff_id, @department_id, GETDATE());
                    `);

            await transaction.commit();

            res.status(200).json({
                success: true,
                message: "Staff added successfully.",
            });
        }
        else {
            // 4.Insert into Staff
            const staffInsert = await request
                .input('department_id', sql.Int, department_id)
                .input('staff_name', sql.NVarChar(50), staff_name.toUpperCase())
                .input('birth_date', sql.Date, birth_date)
                .input('gender', sql.NVarChar(10), gender.toLowerCase())
                .input('salary', sql.Float, base_salary)
                .query(`
                INSERT INTO Staff (department_id, staff_name, birth_date, phone_number ,gender, salary, join_date, staff_status)
                OUTPUT Inserted.staff_id
                VALUES (@department_id, @staff_name, @birth_date, @phone_number, @gender, @salary, GETDATE(), 'active');
            `);
            // 5. Fetch new staff ID
            const newStaffId = staffInsert.recordset[0].staff_id;
            // 6. Insert into WorkHistory
            await request
                .input('staff_id', sql.Int, newStaffId)
                .query(`
                INSERT INTO WorkHistory (staff_id, department_id, starting_date)
                VALUES (@staff_id, @department_id, GETDATE());
            `);

            await transaction.commit();

            res.status(200).json({
                success: true,
                message: "Staff added successfully.",
            });
        }
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error("Rollback failed:", rollbackError.message);
        }

        console.error("Error adding staff:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the staff.",
            error: error.message,
        });
    }
};
// 6.
exports.fireStaff = async (req, res) => {
    const {
        staff_id
    } = req.body
    try {
        const pool = await con;
        const result = await pool.request()
            .input('staff_id', sql.Int, staff_id)
            .query(`EXEC sp_fire_staff @staff_id`);
        return res.status(200).json({
            success: true,
            message: 'Fire staff successfully',
            result: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while firing the staff.",
            error: error.message,
        });
    }
};
// 7.
exports.updateStaffSalary = async (req, res) => {
    const {
        staff_id,
        increase_rate,
    } = req.body
    try {
        const pool = await con;
        const result = await pool.request()
            .input('staff_id', sql.Int, staff_id)
            .input('increase_rate', sql.Float, increase_rate)
            .query(`EXEC sp_update_staff_salary @staff_id, @increase_rate`)
        return res.status(200).json({
            success: true,
            message: "Update staff salary successfully",
            result: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occur when updating staff salary",
            error: error.message
        });
    }
};
// 8.
exports.transferStaff = async (req, res) => {
    const {
        staff_id,
        new_branch_id,
        new_department_name
    } = req.body;
    try {
        const pool = await con;
        const result = await pool.request()
            .input('staff_id', sql.Int, staff_id)
            .input('new_branch_id', sql.VarChar(10), new_branch_id)
            .input('new_department_name', sql.NVarChar(50), new_department_name)
            .query(`EXEC sp_transfer_staff @staff_id, @new_branch_id, @new_department_name`);
        return res.status(200).json({
            success: true,
            message: "Transfer staff successfully",
            result: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot transfer staff",
            error: error.message
        });
    }
};
// 9.
exports.getStaffByName = async (req, res) => {
    const {
        staff_name,
        page_number,
        page_size
    } = req.body;
    try {
        const pool = await con;
        const result = await pool.request()
            .input('staff_name', sql.NVarChar(50), staff_name)
            .input('page_number', sql.Int, page_number)
            .input('page_size', sql.Int, page_size)
            .query('EXEC get_staff_info @staff_name, @page_number, @page_size')
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No staff found by name.',
            });
        }
        res.status(200).json({
            success: true,
            data: result.recordset,
            pagination: {
                page: page_number,
                size: page_size,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot find staff",
            error: error.message
        });
    }
};
// 10.
exports.getBranchRating = async (req, res) => {
    const {
        page_number,
        page_size
    } = req.query;
    try {
        const pool = await con;

        const result = await pool.request()
            .input('page_number', sql.Int, page_number)
            .input('page_size', sql.Int, page_size)
            .execute('sp_get_branch_ratings @page_number, @page_size');

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No branch ratings found.',
            });
        }
        res.status(200).json({
            success: true,
            data: result.recordset,
            pagination: {
                page: page_number,
                size: page_size,
            },
        });
    } catch (error) {
        console.error('Error fetching branch ratings', error.message);

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching branch ratings.',
            error: error.message,
        });
    }
};
// 11.
exports.getStaffRating = async (req, res) => {
    const {
        page_number,
        page_size
    } = req.body;
    try {
        const result = await pool.request()
            .input('page_number', sql.Int, page_number)
            .input('page_size', sql.Int, page_size)
            .execute('sp_get_staff_ratings @page_number, @page_size');

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No staff ratings found.',
            });
        }
        res.status(200).json({
            success: true,
            data: result.recordset,
            pagination: {
                page: page_number,
                size: page_size,
            },
        });
    } catch (error) {
        console.error('Error fetching staff ratings', error.message);

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching staff ratings.',
            error: error.message,
        });
    }
};
// 12.
exports.getSales = async (req, res) => {
    const {
        start_date,
        end_date,
        group_by // day, month, quarter, year
    } = req.body;
    try {
        const result = await pool.request()
            .input('start_date', sql.Date, start_date)
            .input('end_date', sql.Date, end_date)
            .input('group_by', sql.NVarChar(10), group_by)
            .execute('sp_get_branch_revenue_stats @start_date, @end_date, @group_by');

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No sales stats found.',
            });
        }
        res.status(200).json({
            success: true,
            data: result.recordset,
            pagination: {
                page: page_number,
                size: page_size,
            },
        });
    } catch (error) {
        console.error('Error fetching sales data', error.message);

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching sales data.',
            error: error.message,
        });
    }
};
// 13.
exports.getItemSalesStats = async (req, res) => {
    const {
        start_date,
        end_date,
    } = req.body;
    try {
        const result = await pool.request()
            .input('start_date', sql.Date, start_date)
            .input('end_date', sql.Date, end_date)
            .execute('sp_get_branch_revenue_stats @start_date, @end_date');

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No item stats found.',
            });
        }
        res.status(200).json({
            success: true,
            data: result.recordset,
            pagination: {
                page: page_number,
                size: page_size,
            },
        });
    } catch (error) {
        console.error('Error fetching item stats.', error.message);

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching item stats.',
            error: error.message,
        });
    }
};