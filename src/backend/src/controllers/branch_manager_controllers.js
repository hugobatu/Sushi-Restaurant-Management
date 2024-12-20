const { VarChar } = require('msnodesqlv8');
const { sql, con } = require('../configs/dbConfig');  // Import the db connection

// 9. xem danh sách nhân viên theo tên
exports.getStaffDataByName = async (req, res) => {
    const { staff_name, user_id } = req.body;

    // Validate required fields
    if (!staff_name || !user_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    try {
        const pool = await con;

        // Step 1: Fetch branch_id based on user_id
        const branchResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`
                SELECT Department.branch_id
                FROM Department
                JOIN Staff ON Staff.department_id = Department.department_id
                WHERE Staff.staff_id = @user_id;
            `);

        if (!branchResult.recordset || branchResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Branch not found for the given user.",
            });
        }

        const branch_id = branchResult.recordset[0].branch_id;

        // Step 2: Fetch staff data by name and branch_id
        const result = await pool.request()
            .input('staff_name', sql.NVarChar(50), `%${staff_name}%`) // Use LIKE for partial matching
            .input('branch_id', sql.VarChar(10), branch_id)
            .query(`
                SELECT *
                FROM Staff
                WHERE branch_id = @branch_id AND staff_name LIKE @staff_name;
            `);

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No staff found by name.",
            });
        }

        // Return the fetched data
        res.status(200).json({
            success: true,
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error fetching staff data by name:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching staff data.",
            error: error.message,
        });
    }
};
// 12. xem doanh thu của chi nhánh mà quản lý đang quản
exports.getBranchSales = async (req, res) => {
    const {
        start_date,
        end_date,
        user_id,
        group_by // day, month, quarter, year
    } = req.body;
    try {
        const pool = await con;
        const branchResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`
          SELECT Department.branch_id
          FROM Department
          JOIN Staff ON Staff.department_id = Department.department_id
          WHERE Staff.staff_id = @user_id;
      `);

        if (!branchResult.recordset || branchResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Branch not found for the given user.",
            });
        }

        const branch_id = branchResult.recordset[0].branch_id;
        const result = await pool
            .input('start_date', sql.VarChar(10), start_date)
            .input('end_date', sql.VarChar(10), end_date)
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('group_by', sql.NVarChar(10), group_by)
            .execute('sp_get_branch_revenue_stats');

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