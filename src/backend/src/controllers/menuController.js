const db = require('../configs/dbConfig');  // Import the db connection

// Get menu by itemId
// Fetch all menu items for a specific branch
exports.getMenuByBranch = async (req, res) => {
    const { branchId } = req.params; // Extract branchId from params
    console.log("Received branchId:", branchId); // Debug log

    try {
        const [rows] = await db.execute(
            `SELECT * FROM MenuItem mi 
            JOIN BranchMenuItem bmi ON mi.item_id = bmi.item_id 
            WHERE bmi.branch_id = ? AND mi.menu_item_status = "Available"`,
            [branchId.trim()] // Use the trimmed branchId
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No menu items found' });
        }

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching menu items:", error); // Log the error
        res.status(500).json({ success: false, message: error.message });
    }
};


// Add menu item
exports.addMenuItem = async (req, res) => {
    const { branchId } = req.params;
    const { name, price, category } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO MenuItem (branch_id, name, price, category) VALUES (?, ?, ?, ?)',
            [branchId, name, price, category]
        );

        res.status(201).json({ success: true, message: 'Menu item added successfully', data: { id: result.insertId } });

    } catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    const { branchId, itemId } = req.params;
    const { name, price, category } = req.body;

    try {
        await db.execute(
            'UPDATE MenuItem SET name = ?, price = ?, category = ? WHERE id = ? AND branch_id = ?',
            [name, price, category, itemId, branchId]
        );

        res.status(200).json({ success: true, message: 'Menu item updated successfully' });

    } catch (error) {
        console.error("Error updating menu item:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    const { branchId, itemId } = req.params;

    try {
        await db.execute(
            'DELETE FROM MenuItem WHERE id = ? AND branch_id = ?',
            [itemId, branchId]
        );

        res.status(200).json({ success: true, message: 'Menu item deleted successfully' });

    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Add menu category
exports.addMenuCategory = async (req, res) => {
    const { branchId } = req.params;
    const { name } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO MenuCategory (branch_id, name) VALUES (?, ?)',
            [branchId, name]
        );

        res.status(201).json({ success: true, message: 'Menu category added successfully', data: { id: result.insertId } });

    } catch (error) {
        console.error("Error adding menu category:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update menu category
exports.updateMenuCategory = async (req, res) => {
    const { branchId, categoryId } = req.params;
    const { name } = req.body;

    try {
        await db.execute(
            'UPDATE MenuCategory SET name = ? WHERE id = ? AND branch_id = ?',
            [name, categoryId, branchId]
        );

        res.status(200).json({ success: true, message: 'Menu category updated successfully' });

    } catch (error) {
        console.error("Error updating menu category:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Delete menu category
exports.deleteMenuCategory = async (req, res) => {
    const { branchId, categoryId } = req.params;

    try {
        await db.execute(
            'DELETE FROM MenuCategory WHERE id = ? AND branch_id = ?',
            [categoryId, branchId]
        );

        res.status(200).json({ success: true, message: 'Menu category deleted successfully' });

    } catch (error) {
        console.error("Error deleting menu category:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Add combo
exports.addCombo = async (req, res) => {
    const { branchId } = req.params;
    const { name, items } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO Combo (branch_id, name) VALUES (?, ?)',
            [branchId, name]
        );

        const comboId = result.insertId;

        for (const item of items) {
            await db.execute(
                'INSERT INTO ComboItem (combo_id, menu_item_id) VALUES (?, ?)',
                [comboId, item]
            );
        }

        res.status(201).json({ success: true, message: 'Combo added successfully', data: { id: comboId } });

    } catch (error) {
        console.error("Error adding combo:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update combo
exports.updateCombo = async (req, res) => {
    const { branchId, comboId } = req.params;
    const { name, items } = req.body;

    try {
        await db.execute(
            'UPDATE Combo SET name = ? WHERE id = ? AND branch_id = ?',
            [name, comboId, branchId]
        );

        await db.execute(
            'DELETE FROM ComboItem WHERE combo_id = ?',
            [comboId]
        );

        for (const item of items) {
            await db.execute(
                'INSERT INTO ComboItem (combo_id, menu_item_id) VALUES (?, ?)',
                [comboId, item]
            );
        }

        res.status(200).json({ success: true, message: 'Combo updated successfully' });

    } catch (error) {
        console.error("Error updating combo:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Delete combo
exports.deleteCombo = async (req, res) => {
    const { branchId, comboId } = req.params;

    try {
        await db.execute(
            'DELETE FROM Combo WHERE id = ? AND branch_id = ?',
            [comboId, branchId]
        );

        res.status(200).json({ success: true, message: 'Combo deleted successfully' });

    } catch (error) {
        console.error("Error deleting combo:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};