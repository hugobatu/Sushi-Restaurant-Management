const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const path = require('path');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/', require('./src/routes/authRoutes'));
app.use(express.static(path.join(__dirname, 'src/public')));

app.get("/", (req,res) => {
    res.send("<h1>Home page</h1>")
});

const port = 8000;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));