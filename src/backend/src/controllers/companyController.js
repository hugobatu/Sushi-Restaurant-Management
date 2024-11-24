const { CharsetToEncoding } = require('mysql2');
const con = require('../configs/dbConfig');

exports.getBranches = async (req, res) => {
    try {
        const [result] = await con.execute(
            `SELECT * FROM Branch`
        );
        if (!result.length) {
            return res.status(404).json({
                success: false,
                message: 'No branches found',
            });
        }
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching branches data',
            error: error.message,
        });
    }
};
exports.addBranch = async (req, res) => {
    const {
        branch_id,
        branch_name,
        region_id,
        branch_address,
        opening_time,
        closing_time,
        phone_number,
        has_bike_parking_lot,
        has_car_parking_lot,
    } = req.body;

    console.log("Branch details received:", {
        branch_id,
        branch_name,
        region_id,
        branch_address,
        opening_time,
        closing_time,
        phone_number,
        has_bike_parking_lot,
        has_car_parking_lot,
    });

    try {
        // Thực hiện truy vấn INSERT
        const [result] = await con.execute(
            `INSERT INTO Branch (
                branch_id, 
                branch_name, 
                region_id, 
                branch_address, 
                opening_time, 
                closing_time, 
                phone_number, 
                has_bike_parking_lot, 
                has_car_parking_lot
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                branch_id,
                branch_name,
                region_id,
                branch_address,
                opening_time,
                closing_time,
                phone_number,
                has_bike_parking_lot,
                has_car_parking_lot,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Branch added successfully",
            result: result,
        });
    } 
    catch (error) {
        console.error("Error inserting branch:", error); // ghi ra log lỗi
        res.status(500).json({
            success: false,
            message: "Error adding branch",
            error: error.message, // in ra thông tin lỗi
        });
    }
};
exports.deleteBranch = async (req, res) => {
    const {branch_id} = req.params;
    console.log(`Deleting branch with ID: ${branch_id}`);
    try {
        const [result] = await con.execute(
            `DELETE FROM Branch WHERE branch_id = ?`,
            [branch_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false, 
                message: `Branch with ID ${branch_id} not found.`,
            });
        }
        res.status(200).json({
            success: true,
            message: `Branch with ID ${branch_id} deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting branch:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting branch",
            error: error.message,
        });
    }
};
exports.updateBranch = async (req, res) => {
    const {branch_id} = req.params;
    const {
        opening_time,
        closing_time,
        phone_number,
        has_bike_parking_lot,
        has_car_parking_lot,
    } = req.body;
    console.log(`Deleting branch with ID: ${branch_id}`);
    try {
        const [result] = await con.execute(
            `UPDATE Branch
            SET
                opening_time = ?,
                closing_time = ?,
                phone_number = ?,
                has_bike_parking_lot = ?,
                has_car_parking_lot = ?
            WHERE branch_id = ?`,
            [
                opening_time,
                closing_time,
                phone_number,
                has_bike_parking_lot,
                has_car_parking_lot,
                branch_id,
            ]
        );
        res.status(200).json({
            success: true,
            message: "Update branch information successfully",
            result: result,
        });
    }
    catch (error) {
        console.error("Error updating branch information:", error);
        res.status(500).json({
            success: false,
            message: "Error updating branch information",
            error: error.message,
        });
    }
};
exports.addRegion = async(req, res) => {
    const {
        region_id,
        region_name
    } = req.body;
    console.log(`Inserting new region with ${region_id} and ${region_name}`);
    try {
        const [result] = await con.execute(
            `INSERT INTO Region (region_id, region_name)
            VALUES (?, ?)`,
            [
                region_id,
                region_name
            ]
        );
        res.status(200).json({
            success: true,
            message: "Insert new region successfully",
            result: result,
        });
    } catch (error) {
        console.error("Error inserting new region:", error);
        res.status(500).json({
            success: true,
            message: "Error inserting new region",
            result: error.message,        
        });
    }
};
exports.deleteRegion = async (req, res) => {
    const region_id = req.params.region_id;
    console.log(`Deleting region ${region_id}`);
    try {
        const [result] = await con.execute(
            `DELETE FROM Region
            WHERE region_id = ?`,
            [region_id]
        );
        res.status(200).json({
            success: true,
            message: `Delete region ${region_id} successfully`,
            result: result,
        });
    } catch (error) {
        console.error("Error deleting region:", error);
        res.status(500).json({
            success: true,
            message: "Error deleting region",
            result: error.message,        
        });
    }
};

// quản lý staff
exports.getStaff = (req, res) => {
    res.json({ message: 'Danh sách nhân viên' });
};
exports.addStaff = (req, res) => {
    res.json({ message: 'Thêm nhân viên thành công' });
};

exports.getStaffById = (req, res) => {
    res.json({ message: `Nhân viên với ID: ${req.params.id}` });
};

exports.updateStaff = (req, res) => {
    res.json({ message: `Cập nhật nhân viên với ID: ${req.params.id}` });
};

exports.deleteStaff = (req, res) => {
    res.json({ message: `Xóa nhân viên với ID: ${req.params.id}` });
};

// xem doanh thu
exports.getSales = (req, res) => {
    res.json({ message: 'Xem doanh thu hehe.' });
};

exports.getBranchRating = (req, res) => {
    res.json({message: 'Xem đánh giá của chi nhánh'})
};

exports.getStaffRating = (req, res) => {
    res.json({message: 'Xem đánh giá của nhân viên'})
};