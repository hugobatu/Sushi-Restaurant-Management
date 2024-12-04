const bcrypt = require('bcrypt');
const { generateUsername } = require('../utils/stringUtils');

// Ensure unique username in the Account table
const getUniqueUsername = async (baseUsername, con) => {
    let username = baseUsername;
    let count = 1;
    let isUnique = false;

    while (!isUnique) {
        const [rows] = await con.execute(
            `SELECT COUNT(*) as count FROM Account WHERE username = ?`,
            [username]
        );

        if (rows[0].count === 0) {
            isUnique = true;
        } else {
            username = `${baseUsername}${count}`;
            count++;
        }
    }
    return username;
};

const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, 10);
};

module.exports = { getUniqueUsername, hashPassword };