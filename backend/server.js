// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db'); // MongoDB connection function
const userRoutes = require('./routes/userRoutes'); // User routes
const blogRoutes = require('./routes/blogRoutes'); // Blog routes
const newsRoutes = require('./routes/newsRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*', // Replace '*' with your frontend's URL (e.g., https://yourfrontend.com) for stricter security
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict allowed HTTP methods
    credentials: true, // Enable credentials for CORS
  })
);
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/news', newsRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).send('Backend is running!');
});

// User routes
app.use('/users', userRoutes);

// Blog routes
app.use('/blogs', blogRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});