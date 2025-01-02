const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const iconv = require('iconv-lite');
const throttledQueue = require('throttled-queue');

const API_URL = 'http://localhost:8000/staff/customer/add';

// Create a throttle instance
const throttle = throttledQueue(300, 1000); // 5 requests per second

const readCustomerDataFromCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        const customers = [];
        fs.createReadStream(fileName)
            .pipe(iconv.decodeStream('utf16-be')) // Decode UTF-16BE to UTF-8
            .pipe(iconv.encodeStream('utf8'))    // Ensure the data is UTF-8
            .pipe(csv())
            .on('data', (row) => {
                customers.push(row);
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
        console.error(`Error inserting ${customer.customer_name}:`, error.response?.data || error.message);
    }
};

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

const fileName = './';
insertCustomersFromCSV(fileName);