// routes/vendorRoutes.js
const express = require('express');
const { createvendor, getAllvendors } = require('../../../controllers/Vendor/auth/vendorController');
const router = express.Router();

router.post('/vendorRegister', createvendor); // Create a new vendor
router.get('/vendorGet', getAllvendors); // Get all vendors

module.exports = router;
