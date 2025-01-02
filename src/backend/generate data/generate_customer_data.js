const { Parser } = require('json2csv');
const fs = require('fs');
const faker = require('faker');

const generateCustomers = (count) => {
    const genders = ["male", "female"];
    const customers = [];

    for (let i = 0; i < count; i++) {
        customers.push({
            customer_name: faker.name.findName(),
            email: faker.internet.email(),
            phone_number: faker.phone.phoneNumber("09########"),
            gender: faker.helpers.randomize(genders),
            birth_date: faker.date.between("1950-01-01", "2005-12-31").toISOString().split("T")[0],
            id_number: Array.from({ length: 12 }, () => faker.random.arrayElement("0123456789")).join(''),
        });
    }
    
    return customers;
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

const customers = generateCustomers(10000); // 100 customers
exportToCSV(customers, './data/customers.csv');