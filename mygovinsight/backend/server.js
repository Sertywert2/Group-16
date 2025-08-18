'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mygovinsights', {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err.message));

// Route Middleware (each route handles its own uploads inside the file)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/analytics', require('./routes/analytics'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
