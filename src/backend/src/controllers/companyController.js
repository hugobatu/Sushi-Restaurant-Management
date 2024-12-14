const { con, sql} = require('../configs/dbConfig');
const { getUniqueUsername, hashPassword } = require('../utils/accountService');
const { generateUsername, formatBirthDate } = require('../utils/stringUtils');

exports.getBranches = async (req, res) => {
    try {
        const pool = await con;
        const result = await pool.request()
            .query('EXEC sp_get_branches_data 1, 10');
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No branches founed',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Branches found',
            data: result.recordset,
            result: result
        });
    } catch (error) {
        console.error('Error fetching branches:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching branches data',
            error: error.message,
        });
    }
};
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

    console.log("Branch details received:", {
        region_id,
        branch_name,
        branch_address,
        opening_time,
        closing_time,
        phone_number,
        has_bike_parking_lot,
        has_car_parking_lot,
    });

    try {
        // Thực hiện truy vấn INSERT
        const pool = await con;
        const [result] = await pool.request()
            .input('region_id', sql.VarChar(10), region_id)
            .input('branch_name', sql.NVarChar(50), branch_name)
            .input('branch_address', sql.NVarChar(50), branch_address)
            .input('opening_time', sql.Time, opening_time)
            .input('closing_time', sql.Time, closing_time)
            .input('phone_number', sql.VarChar(10), phone_number)
            .input('has_bike_parking_lot', sql.Bit, has_bike_parking_lot)
            .input('has_car_parking_lot', sql.Bit, has_car_parking_lot)
            .query(`EXEC sp_add_branch @region_id, @branch_name, @branch_address, 
                @opening_time, @closing_time, @phone_number, @has_bike_parkinglot, @has_car_parking_lot`)
        res.status(200).json({
            success: true,
            message: "Branch added successfully",
            result: result,
        });
    } 
    catch (error) {
        console.error("Error inserting branch:", error);
        res.status(500).json({
            success: false,
            message: "Error adding branch",
            error: error.message,
        });
    }
};
// exports.deleteBranch = async (req, res) => {
//     const {branch_id} = req.params;
//     console.log(`Deleting branch with ID: ${branch_id}`);
//     try {
//         const [result] = await con.execute(
//             `DELETE FROM Branch WHERE branch_id = ?`,
//             [branch_id]
//         );
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false, 
//                 message: `Branch with ID ${branch_id} not found.`,
//             });
//         }
//         res.status(200).json({
//             success: true,
//             message: `Branch with ID ${branch_id} deleted successfully.`,
//         });
//     } catch (error) {
//         console.error("Error deleting branch:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error deleting branch",
//             error: error.message,
//         });
//     }
// };
// exports.updateBranch = async (req, res) => {
//     const {branch_id} = req.params;
//     const {
//         opening_time,
//         closing_time,
//         phone_number,
//         has_bike_parking_lot,
//         has_car_parking_lot,
//     } = req.body;
//     console.log(`Deleting branch with ID: ${branch_id}`);
//     try {
//         const [result] = await con.execute(
//             `UPDATE Branch
//             SET
//                 opening_time = ?,
//                 closing_time = ?,
//                 phone_number = ?,
//                 has_bike_parking_lot = ?,
//                 has_car_parking_lot = ?
//             WHERE branch_id = ?`,
//             [
//                 opening_time,
//                 closing_time,
//                 phone_number,
//                 has_bike_parking_lot,
//                 has_car_parking_lot,
//                 branch_id,
//             ]
//         );
//         res.status(200).json({
//             success: true,
//             message: "Update branch information successfully",
//             result: result,
//         });
//     }
//     catch (error) {
//         console.error("Error updating branch information:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error updating branch information",
//             error: error.message,
//         });
//     }
// };
// exports.addRegion = async(req, res) => {
//     const {
//         region_id,
//         region_name
//     } = req.body;
//     console.log(`Inserting new region with ${region_id} and ${region_name}`);
//     try {
//         const [result] = await con.execute(
//             `INSERT INTO Region (region_id, region_name)
//             VALUES (?, ?)`,
//             [
//                 region_id,
//                 region_name
//             ]
//         );
//         res.status(200).json({
//             success: true,
//             message: "Insert new region successfully",
//             result: result,
//         });
//     } catch (error){
//         console.error("Error inserting new region:", error);
//         res.status(500).json({
//             success: true,
//             message: "Error inserting new region",
//             result: error.message,        
//         });
//     }
// };
// exports.deleteRegion = async (req, res) => {
//     const region_id = req.params.region_id;
//     console.log(`Deleting region ${region_id}`);
//     try {
//         const [result] = await con.execute(
//             `DELETE FROM Region
//             WHERE region_id = ?`,
//             [region_id]
//         );
//         res.status(200).json({
//             success: true,
//             message: `Delete region ${region_id} successfully`,
//             result: result,
//         });
//     } catch (error) {
//         console.error("Error deleting region:", error);
//         res.status(500).json({
//             success: true,
//             message: "Error deleting region",
//             result: error.message,        
//         });
//     }
// };
// // quản lý staff
// exports.getStaff = async(req, res) => {
//     try {
//         const [result] = await con.execute(
//             'SELECT * FROM Staff'
//         );
//         res.status(200).json({
//             success: true,
//             message: "Getting staff information successfully",
//             result: result
//         });
//     } catch (error) {
//         console.error("Error fetching staff data:", error);
//         res.status(500).json({
//             success: false,
//             message: "Cannot fetch staff data",
//             error: error.message,
//         });
//     }
// };
// exports.addStaff = async (req, res) => {
//     const {
//         staff_id,
//         branch_id,
//         department_id,
//         staff_name,
//         birth_date,
//         gender,
//         salary,
//         join_date,
//         staff_status,
//     } = req.body;       
//     if (!staff_id || !branch_id || !department_id || !staff_name || !birth_date) {
//         return res.status(400).json({
//             success: false,
//             message: 'Missing required fields.',
//         });
//     }
//     try {
//         const [staffResult] = await con.execute(
//             `INSERT INTO Staff (
//                 staff_id, branch_id, department_id, staff_name, birth_date, gender, 
//                 salary, join_date, staff_status, username
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 staff_id,
//                 branch_id,
//                 department_id,
//                 staff_name,
//                 birth_date,
//                 gender,
//                 salary,
//                 join_date,
//                 staff_status,
//                 null, // username null by default for non-manager staff
//             ]
//         );
//         let accountInfo = null; // in case of creating new account for customer
//         if (department_id === 'QL') {
//             let usernameBase = generateUsername(staff_name);
//             let username = await getUniqueUsername(usernameBase, con);
//             const plain = formatBirthDate(birth_date);
//             const hashed = await hashPassword(plain);

//             await con.execute(
//                 `INSERT INTO Account (username, password, role)
//                 VALUES (?, ?, ?)`,
//                 [username, hashed, 'branchManager']
//             );
//                 await con.execute(
//                 `UPDATE Staff
//                 SET username = ?
//                 WHERE staff_id = ?`,
//                 [username, staff_id]
//             );
//             accountInfo = {
//                 username,
//                 plain,
//             };
//         }
//         res.status(200).json({
//             success: true,
//             message: 'Nhân viên được thêm thành công',
//             data: {
//                 staff_id,
//                 account: accountInfo,
//             },
//         });
//     } catch (error) {
//         console.error('Error adding staff:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi khi thêm nhân viên',
//             error: error.message,
//         });
//     }
// };

// exports.getStaffById = (req, res) => {
//     res.json({ message: `Nhân viên với ID: ${req.params.id}` });
// };

// exports.updateStaff = (req, res) => {
//     res.json({ message: `Cập nhật nhân viên với ID: ${req.params.id}` });
// };

// exports.deleteStaff = (req, res) => {
//     res.json({ message: `Xóa nhân viên với ID: ${req.params.id}` });
// };

// // xem doanh thu
// exports.getSales = (req, res) => {
//     res.json({ message: 'Xem doanh thu hehe.' });
// };

// exports.getBranchRating = (req, res) => {
//     res.json({message: 'Xem đánh giá của chi nhánh'})
// };

// exports.getStaffRating = (req, res) => {
//     res.json({message: 'Xem đánh giá của nhân viên'})
// };