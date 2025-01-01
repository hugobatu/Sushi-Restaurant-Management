const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { formatBirthDate } = require('../src/utils/stringUtils');
const API_URL = 'http://localhost:8000/signup';

// Hàm tạo username và password (username vẫn là email, password là phone_number)
const generateUsernameAndPassword = (phone_number, birth_date) => {
    const username = phone_number; // số điện thoại là tên tài khoản
    const password = formatBirthDate(birth_date); // mật khẩu là ngày tháng năm sinh
    return { username, password };
};

const readCustomerDataFromCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        const customers = [];
        fs.createReadStream(fileName)
            .pipe(csv())
            .on('data', (row) => {
                const { username, password } = generateUsernameAndPassword(row.phone_number, row.birth_date);
                customers.push({
                    ...row,
                    username,
                    password
                });
            })
            .on('end', () => {
                resolve(customers);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

const sendCustomerData = async (customer) => {
    try {
        const response = await axios.post(API_URL, customer);
        console.log(`Inserted: ${customer.customer_name} - Status: ${response.status}`);
    } catch (error) {
        console.error(`Error inserting ${customer.customer_name}: ${error.message}`);
    }
};

const insertCustomersFromCSV = async (fileName) => {
    try {
        const customers = await readCustomerDataFromCSV(fileName);
        console.log(`Parsed ${customers.length} customers. Sending to API...`);

        for (const customer of customers) {
            await sendCustomerData(customer);
        }
        console.log('All customers have been processed.');
    } catch (error) {
        console.error('Error processing customers:', error.message);
    }
};

const fileName = './data/customers_data.csv';
insertCustomersFromCSV(fileName);