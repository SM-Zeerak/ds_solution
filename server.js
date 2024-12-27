const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const vendorRoutes = require('./routes/Vendor/vendorRoutes');
const teamRoutes = require('./routes/Team/teamRoutes');
const userRoutes = require('./routes/user/userRoutes');
const productRoutes = require('./routes/Product/productRoutes');
const categoryRoutes = require('./routes/Category/categoryRoutes');
const orderRoutes = require('./routes/Orders/orderRoutes');
const walletRoutes = require('./routes/Wallet/walletRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Serve static files from the "uploads" directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// API Routes
app.use('/api', vendorRoutes);
app.use('/api', teamRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', walletRoutes);


// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to DZ Solution API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



