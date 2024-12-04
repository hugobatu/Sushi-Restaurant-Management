const sql = require('mssql');
const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw new Error('Failed to load .env file');
}

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: "SQLEXPRESS"
    },
    port: process.env.PORT
};

// Create a connection pool
const pool = sql.connect(config)
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool; // Return the pool for reusability
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        throw err;
    });

module.exports = pool;