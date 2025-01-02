const fs = require('fs');
const csvParser = require('csv-parser');
const axios = require('axios');
const iconv = require('iconv-lite');

const sendStaffData = async (staff) => {
    try {
        const response = await axios.post('http://localhost:8000/company/staff/add', staff);
        console.log(`Inserted: ${staff.staff_name} - Status: ${response.status}`);
    } catch (error) {
        console.error(`Error inserting ${staff.staff_name}:`, error.response?.data || error.message);
    }
};

const importStaffFromCSV = (csvFilePath) => {
    const staffData = [];

    fs.createReadStream(csvFilePath)
        .pipe(iconv.decodeStream('utf16-be')) // Convert UTF-16BE to UTF-8
        .pipe(iconv.encodeStream('utf8'))    // Ensure the data is in UTF-8
        .pipe(csvParser())
        .on('data', (row) => {
            staffData.push({
                branch_id: row.branch_id,
                department_name: row.department_name,
                staff_name: row.staff_name,
                birth_date: row.birth_date,
                phone_number: row.phone_number,
                gender: row.gender,
            });
        })
        .on('end', async () => {
            console.log(`Parsed ${staffData.length} rows. Sending to API...`);
            for (const staff of staffData) {
                await sendStaffData(staff);
            }
            console.log('All data sent to the API.');
        });
};

const csvFilePath = './data/staff_data.csv';
importStaffFromCSV(csvFilePath);