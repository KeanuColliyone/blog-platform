const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db'); // MongoDB connection function
const userRoutes = require('./routes/userRoutes'); // User routes
const blogRoutes = require('./routes/blogRoutes'); // Blog routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://keanucolliyone.github.io/blog-platform/',}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
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

// Blog routes
app.use('/blogs', blogRoutes);

// Static file serving for uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});