const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const iconv = require('iconv-lite');
const throttledQueue = require('throttled-queue');

// Throttling setup - 15 requests per second
const throttle = throttledQueue(300, 1000);
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
        const stream = fs.createReadStream(fileName)
            .pipe(iconv.decodeStream('utf16be')) // Decode UTF-16BE to UTF-8
            .pipe(csv());

        stream.on('data', (row) => {
            customers.push({
                customer_id: row.customer_id,
                customer_name: row.customer_name,
                email: row.email,
                phone_number: row.phone_number,
                gender: row.gender,
                birth_date: row.birth_date,
                id_number: row.id_number,
                username: row.username,
            });
        });

        stream.on('end', () => {
            resolve(customers);
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
};

const createOrder = async (user_id, customer_name, phone_number, table_id, menuItems) => {
    const numItems = Math.floor(Math.random() * 5) + 1; // Select 1 to 5 items
    const selectedItems = [];
    const selectedItemIds = new Set();

    while (selectedItems.length < numItems) {
        const item = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;

        if (!selectedItemIds.has(item)) {
            selectedItems.push({
                item_id: item,
                quantity: quantity,
            });
            selectedItemIds.add(item);
        }
    }

    const orderData = {
        user_id: user_id,
        customer_name: customer_name,
        phone_number: phone_number,
        table_id: table_id,
        items: selectedItems,
    };

    try {
        const response = await axios.post(API_URL, orderData);
        console.log(`Order created for ${customer_name} - Status: ${response.status}`);
    } catch (error) {
        console.error(`Error creating order for ${customer_name}: ${error.message}`);
    }
};

const processOrdersFromCSV = async (customerFile, menuFile) => {
    try {
        const customers = await readCustomerDataFromCSV(customerFile);
        const menuItems = await readMenuItemsFromCSV(menuFile);
        console.log(`Parsed ${customers.length} customers and ${menuItems.length} menu items. Creating orders...`);

        const ordersToCreate = [];
        const ordersCount = 500; // 10,000 orders per user
        const user_ids = [6, 23, 36, 60, 66, 80, 96, 110, 126, 143]; // Array of user IDs

        for (const user_id of user_ids) {
            for (let i = 0; i < ordersCount; i++) {
                const customer = customers[Math.floor(Math.random() * customers.length)];
                if (!customer || !customer.customer_name || !customer.phone_number) {
                    console.error('Invalid customer data:', customer);
                    continue;
                }

                const { customer_name, phone_number } = customer;

                const table_id = Math.floor(Math.random() * 30) + 1;

                ordersToCreate.push(
                    throttle(() => createOrder(user_id, customer_name, phone_number, table_id, menuItems))
                );
            }
        }

        const batchSize = 100;
        for (let i = 0; i < ordersToCreate.length; i += batchSize) {
            const batch = ordersToCreate.slice(i, i + batchSize);
            await Promise.all(batch);
            console.log(`Processed ${i + batch.length} orders`);
        }

        console.log('All orders have been processed.');
    } catch (error) {
        console.error('Error processing orders:', error.message);
    }
};

const customerFile = './data/customers_data.csv';
const menuFile = './data/menu_item.csv';
processOrdersFromCSV(customerFile, menuFile);
