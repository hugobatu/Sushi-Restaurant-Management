// src/app.js
const express = require('express');
const app = express();
const port = 3000
// Import route
const companyRoutes = require('./routes/companyRoutes');

// Route cho /
app.get('/', (req, res) => {
    res.send('Welcome to the Sushi Restaurant Management API!');
  });

// Sử dụng routes mà không thêm `/api`
app.use('/branches', companyRoutes) => {
  res.send('Welcome to branches');
};  // Route này sẽ trả về các công ty ở URL /companies

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
