const { MAX } = require('mssql');
const { con, sql } = require('../configs/dbConfig');
const { hashPassword } = require('../utils/accountService');
const { formatBirthDate } = require('../utils/stringUtils');
const { reset } = require('nodemon');

// 1. Add a menu item to a branch
exports.addBranchMenuItem = async (req, res) => {
    const { user_id, item_id } = req.body;
    
    if (!user_id || !item_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields (user_id, item_id).",
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

        // Step 2: Add menu item to the branch
        await pool.request()
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('item_id', sql.VarChar(10), item_id)
            .execute('sp_add_menu_branch');

        return res.status(200).json({
            success: true,
            message: "Menu item added to the branch successfully.",
        });
    } catch (error) {
        console.error("Error adding menu item to branch:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the menu item to the branch.",
            error: error.message,
        });
    }
};
// 2. Delete a menu item from a branch
exports.deleteBranchMenuItem = async (req, res) => {
    const { user_id, item_id } = req.body;

    if (!user_id || !item_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields (user_id, item_id).",
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

        // Step 2: Delete menu item from the branch
        await pool.request()
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('item_id', sql.VarChar(10), item_id)
            .execute('sp_delete_menu_branch');

        return res.status(200).json({
            success: true,
            message: "Menu item deleted from the branch successfully.",
        });
    } catch (error) {
        console.error("Error deleting menu item from branch:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the menu item from the branch.",
            error: error.message,
        });
    }
};
// 3. change status of branch menu item
exports.changeBranchMenuItem = async (req, res) => {
    const { user_id, item_id, is_available } = req.body;

    if (user_id === undefined || item_id === undefined || is_available === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields (user_id, item_id, is_available).",
        });
    }

    try {
        const pool = await con;

        // Fetch branch_id based on user_id
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
                message: `No branch found for user_id: ${user_id}.`,
            });
        }

        const branch_id = branchResult.recordset[0].branch_id;

        // Update menu item status for the branch
        await pool.request()
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('item_id', sql.VarChar(10), item_id)
            .input('is_available', sql.Bit, is_available)
            .execute('sp_change_status_branch_menu_item');
        
        return res.status(200).json({
            success: true,
            message: `Menu item status updated successfully for branch_id: ${branch_id}.`,
        });
    } catch (error) {
        console.error("Error changing branch menu item status:", error.message);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
            error: error.message,
        });
    }
};
// *. Get all menu items from all branches
exports.getBranchMenuItem = async (req, res) => {
    const {
        page_number = 1,
        page_size = 1000
    } = req.body
    try {
        const pool = await con;
        const result = await pool.request()
            .query('EXEC sp_get_branches_menu_items');
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No menu items found',
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
        console.error('Error fetching menu items data', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching menu items data',
            error: error.message,
        });
    }
};
// 4.
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
                FROM Staff S
                JOIN Department D
                ON D.department_id = S.department_id
                WHERE D.branch_id = @branch_id AND staff_name LIKE @staff_name;
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
// 5. xem tất cả nhân viên theo chi nhánh mà manager đó đang quản lý
exports.getAllBranchStaffData = async (req, res) => {
    const { user_id } = req.body;

    // Validate required fields
    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    try {
        const pool = await con;

        // Step 1: Fetch branch_id based on user_id (manager)
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

        // Step 2: Fetch staff by branch_id of manager
        const result = await pool.request()
            .input('branch_id', sql.VarChar(10), branch_id)
            .query(`
                SELECT *
                FROM Staff S
                JOIN Department D
                ON D.department_id = S.department_id
                WHERE D.branch_id = @branch_id;
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
        console.error("Error fetching staff info using user id of branch manager:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching staff data.",
            error: error.message,
        });
    }
};
// 6. xem đánh giá nhân viên theo chi nhánh mà manager đó đang quản lý
exports.getBranchStaffRatings = async (req, res) => {
    const {
        user_id,
        page_number,
        page_size
    } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields.",
            });
        }
        const pool = await con;
        // Step 1: Fetch branch_id based on user_id (manager)
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
            .input('branch_id', sql.VarChar(10), branch_id)
            .input('page_number', sql.Int, page_number)
            .input('page_size', sql.Int, page_size)
            .query(`EXEC sp_get_branch_ratings @branch_id, @page_number, @page_size`)

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No staff ratings found.",
            });
        }

        // Return the fetched data
        res.status(200).json({
            success: true,
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error fetching staff rating using user id of branch manager:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching staff rating.",
            error: error.message,
        });
    }
}
// 7. xem doanh thu của chi nhánh mà quản lý đang quản
exports.getBranchSales = async (req, res) => {
    const {
        start_date,
        end_date,
        user_id,
        group_by // day, month, quarter, year
    } = req.body;
    try {
        if (!start_date || !end_date || !user_id || !group_by) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields.",
            });
        }
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