const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '../../certs', 'isrgrootx1.pem')),
    },
});

module.exports = pool.promise();