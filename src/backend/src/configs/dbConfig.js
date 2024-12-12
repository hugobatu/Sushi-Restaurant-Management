const { Sequelize } = require('sequelize');
const sql = require('mssql');
const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw new Error('Failed to load .env file');
}

// sequelize configuration (ORM)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVER,
    dialect: 'mssql', // use the mssql dialect for Sequelize
    dialectOptions: {
        options: { trustServerCertificate: true },
    },
});

// raw sql
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

const con = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        throw err;
    });

module.exports = { sequelize, con };