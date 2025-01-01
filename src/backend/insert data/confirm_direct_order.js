const axios = require('axios');
const throttledQueue = require('throttled-queue');

// Constants
const VIEW_ORDERS_API = 'http://localhost:8000/staff/customer/order/view';
const CONFIRM_ORDER_API = 'http://localhost:8000/staff/customer/order/confirm-direct';

// The list of user IDs
const user_ids = [6, 23, 36, 60, 66, 80, 96, 110, 126, 143];

// Create a throttled queue with a max of 1 request per second
const throttle = throttledQueue(300, 1000);  // 1 request per second

// Fetch orders for a given user
const fetchOrdersForUser = async (user_id, order_status = 'pending') => {
    try {
        const response = await axios.get(VIEW_ORDERS_API, {
            params: { user_id, order_status },
        });

        // Log the full response to inspect its structure
        // console.log(`Full response for user ${user_id}:`, response.data);
        
        // Check if the response contains 'success' and the 'order' array
        if (response.data && response.data.success && Array.isArray(response.data.order)) {
            // console.log(`Fetched orders for user ${user_id}:`, response.data.order.length);
            return response.data.order.map(order => order.order_id); // Extract only the order_id values
        } else {
            console.error(`Unexpected response format for user ${user_id}:`, response.data);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching orders for user ${user_id}: ${error.message}`);
        return [];
    }
};

// Confirm an order by its order_id
const confirmOrder = async (user_id, order_id) => {
    try {
        const data = {
            user_id,
            order_id,
            vat: 0.08,  // Example static value for VAT
            servile_manner_rating: Math.floor(Math.random() * 10) + 1,
            branch_rating: Math.floor(Math.random() * 10) + 1,
            food_quality_rating: Math.floor(Math.random() * 10) + 1,
            price_rating: Math.floor(Math.random() * 10) + 1,
            surroundings_rating: Math.floor(Math.random() * 10) + 1,
            personal_response: "Excellent service, would love to return!" // Random feedback
        };

        const response = await axios.post(CONFIRM_ORDER_API, data);
        console.log(`Order ${order_id} confirmed for user ${user_id}:`, response.status);
    } catch (error) {
        console.error(`Error confirming order ${order_id} for user ${user_id}: ${error.message}`);
    }
};

// Process all users with throttled requests
const processOrdersForAllUsers = async () => {
    for (let i = 0; i < user_ids.length; i++) {
        const user_id = user_ids[i];
        console.log(`Fetching orders for user ${user_id}...`);

        const order_ids = await fetchOrdersForUser(user_id);
        if (order_ids.length === 0) {
            console.log(`User ${user_id} has no orders to confirm.`);
            continue;
        }

        console.log(`User ${user_id} has ${order_ids.length} orders to confirm.`);

        // Throttle each order confirmation to ensure the rate is limited
        for (let order_id of order_ids) {
            throttle(() => confirmOrder(user_id, order_id)); // Throttled request
        }
    }

    console.log('All orders have been processed.');
};

// Start the process
processOrdersForAllUsers(); 