const { Parser } = require('json2csv');
const fs = require('fs');
const faker = require('faker');

// Hàm generate nhân viên
const generateStaffData = (branchId) => {
    const departments = {
        "chef": 4,
        "staff": 4,
        "security": 6,
        "manager": 1,
    };
    
    const genders = ["male", "female"];
    const staffData = [];

    Object.entries(departments).forEach(([departmentName, count]) => {
        for (let i = 0; i < count; i++) {
            staffData.push({
                branch_id: branchId,
                department_name: departmentName,
                staff_name: faker.name.findName(),
                birth_date: faker.date.between("1980-01-01", "2002-12-31").toISOString().split("T")[0],
                phone_number: faker.phone.phoneNumber("09########"),
                gender: faker.helpers.randomize(genders),
            });
        }
    });
    return staffData;
};

const exportToCSV = (data, fileName) => {
    try {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        fs.writeFileSync(fileName, csv);
        console.log(`Export to: ${fileName} successfully`);
    } catch (error) {
        console.error("Error while exporting to CSV:", error);
    }
};

const branchIds = ['B001', 'B002', 'B003', 'B004', 'B004', 'B005', 'B006', 'B007', 'B008', 'B009', 'B010'];
let allStaffData = [];

branchIds.forEach(branchId => {
    const staffData = generateStaffData(branchId);
    allStaffData = allStaffData.concat(staffData);
});

exportToCSV(allStaffData, './generate data/staff_data.csv');