const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db'); // MongoDB connection function
const userRoutes = require('./routes/userRoutes'); // User routes
const jwt = require('jsonwebtoken');

require('dotenv').config();

// Load environment variables
dotenv.config();

// Initialize Firebase Admin (optional, adjust path if needed)
// const admin = require('./config/firebase-admin');

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// User routes
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});