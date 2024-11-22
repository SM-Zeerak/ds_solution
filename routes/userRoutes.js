// // routes/userRoutes.js
// const express = require('express');
// const { createUser, getAllUsers } = require('../controllers/userController');
// const router = express.Router();

// router.post('/vendorsRegister', createUser); // Create a new user
// router.get('/users', getAllUsers); // Get all users

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { createUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();

// Set up multer to handle file upload
const upload = multer({ dest: 'profileUpload/' }); // Save images to the 'uploads' directory

// Create a new user (with profile image)
router.post('/vendorsRegister', upload.single('profileImage'), createUser); // Single file upload (profileImage)

// Get all users
router.get('/users', getAllUsers); // Get all users

module.exports = router;
