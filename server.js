// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const vendorRoutes = require('./routes/vendorRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api', vendorRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to DZ Solution API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
