const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const throttledQueue = require('throttled-queue');
const iconv = require('iconv-lite');
const { formatBirthDate } = require('../src/utils/stringUtils');

const API_URL = 'http://localhost:8000/signup';

// Tạo throttle queue
const throttle = throttledQueue(300, 1000);

// Hàm tạo username và password
const generateUsernameAndPassword = (phone_number, birth_date) => {
    const username = phone_number; // Số điện thoại là tên tài khoản
    const password = formatBirthDate(birth_date); // Mật khẩu là ngày tháng năm sinh
    return { username, password };
};

// Đọc dữ liệu từ file CSV mã hóa UTF-16BE
const readCustomerDataFromCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        const customers = [];
        fs.createReadStream(fileName)
            .pipe(iconv.decodeStream('utf16-be')) // Chuyển đổi từ UTF-16BE sang UTF-8
            .pipe(iconv.encodeStream('utf8'))    // Đảm bảo dữ liệu là UTF-8
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

// Gửi dữ liệu khách hàng
const sendCustomerData = async (customer) => {
    try {
        const response = await axios.post(API_URL, customer);
        console.log(`Inserted: ${customer.customer_name} - Status: ${response.status}`);
    } catch (error) {
        console.error(`Error inserting ${customer.customer_name}:`, error.response?.data || error.message);
    }
};

// Xử lý dữ liệu khách hàng từ CSV
const insertCustomersFromCSV = async (fileName) => {
    try {
        const customers = await readCustomerDataFromCSV(fileName);
        console.log(`Parsed ${customers.length} customers. Sending to API...`);

        for (const customer of customers) {
            await throttle(() => sendCustomerData(customer));
        }

        console.log('All customers have been processed.');
    } catch (error) {
        console.error('Error processing customers:', error.message);
    }
};

// Đường dẫn file CSV
const fileName = './data/customers_data.csv';
insertCustomersFromCSV(fileName);