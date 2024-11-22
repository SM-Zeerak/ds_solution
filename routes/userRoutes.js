// routes/userRoutes.js
const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/vendorRegister', createUser); // Create a new user
router.get('/vendorGet', getAllUsers); // Get all users

module.exports = router;
