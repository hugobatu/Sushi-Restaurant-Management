const express = require('express');
const dotenv = require('dotenv').config(); // Load .env variables
const fs = require('fs')
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2'); // Database module
const authRoutes = require('./src/routes/authRoutes');
const authController = require('./src/controllers/authController');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'src/public')));

// Database connection
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, './certs', 'isrgrootx1.pem')),
    },
});

con.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the app if database connection fails
    }
    console.log('Connected to the database!');
        if (err) throw err;
        var sql = "SELECT * FROM Region";
        con.query(sql, function(err, results) {
          if (err) throw err;
          console.log(results);
        })
});


app.use('/auth', authRoutes);



// Routes
// app.get("/", (req, res) => {
//     res.send("<h1>Home page</h1>");
// });

app.post('/signup', authController.signup);
app.post('/login', authController.login);



// test FE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public', 'index.html'));
});
// Start server
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});