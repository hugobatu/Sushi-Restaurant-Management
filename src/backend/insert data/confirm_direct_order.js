const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const iconv = require('iconv-lite');
const throttledQueue = require('throttled-queue');

// Throttling setup - 15 requests per second
const throttle = throttledQueue(100, 1000);
const API_URL = 'http://localhost:8000/staff/customer/order/create';

const readMenuItemsFromCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        const menuItems = [];
        const stream = fs.createReadStream(fileName)
            .pipe(iconv.decodeStream('utf16be')) // Decode UTF-16BE to UTF-8
            .pipe(csv());

        stream.on('data', (row) => {
            menuItems.push(row.item_id); // Push item_id to array
        });

        stream.on('end', () => {
            resolve(menuItems);
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
};

const readCustomerDataFromCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        const customers = [];
        fs.createReadStream(fileName)
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

const createOrder = async (user_id, customer_name, phone_number, table_id, menuItems) => {
    const numItems = Math.floor(Math.random() * 3) + 1; // Select 1-3 items
    const selectedItems = [];

    for (let i = 0; i < numItems; i++) {
        const item = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        selectedItems.push({
            item_id: item,
            quantity: quantity
        });
    }

    const orderData = {
        user_id: user_id,
        customer_name: customer_name,
        phone_number: phone_number,
        table_id: table_id,
        items: selectedItems
    };

    try {
        const response = await axios.post(API_URL, orderData);
        console.log(`Order created for ${customer_name} - Status: ${response.status}`);
    } catch (error) {
        console.error(`Error creating order for ${customer_name}: ${error.message}`);
    }
};

// Function to create orders with throttling and batching
const processOrdersFromCSV = async (customerFile, menuFile) => {
    try {
        const customers = await readCustomerDataFromCSV(customerFile);
        const menuItems = await readMenuItemsFromCSV(menuFile);
        console.log(`Parsed ${customers.length} customers and ${menuItems.length} menu items. Creating orders...`);

        const ordersToCreate = [];
        const ordersCount = 10000; // 10,000 orders per user
        const user_ids = [6, 23, 36, 60, 66, 80, 96, 110, 126, 143]; // Array of user IDs

        // Iterate through each user_id and create 10,000 orders
        for (const user_id of user_ids) {
            for (let i = 0; i < ordersCount; i++) {
                const customer = customers[Math.floor(Math.random() * customers.length)]; // Randomly pick a customer
                const { customer_name, phone_number } = customer;

                // Generate a random table_id between 1 and 30
                const table_id = Math.floor(Math.random() * 30) + 1;

                // Add the order creation function to the queue with throttling
                ordersToCreate.push(
                    throttle(() => createOrder(user_id, customer_name, phone_number, table_id, menuItems))
                );
            }
        }

        // Batch processing - process orders in smaller groups to avoid overwhelming the server
        const batchSize = 100; // Adjust batch size as needed
        for (let i = 0; i < ordersToCreate.length; i += batchSize) {
            const batch = ordersToCreate.slice(i, i + batchSize);
            await Promise.all(batch); // Process batch in parallel
            console.log(`Processed ${i + batch.length} orders`);
        }

        console.log('All orders have been processed.');
    } catch (error) {
        console.error('Error processing orders:', error.message);
    }
};

const customerFile = './data/customers_data.csv';
const menuFile = './data/menu_item.csv';  // Make sure this file contains item_id and item_name

processOrdersFromCSV(customerFile, menuFile);