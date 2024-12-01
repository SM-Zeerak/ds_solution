const express = require('express');
const { createCategory, getAllCategories } = require('../../controllers/Category/categoryController');
const { updateCategory } = require('../../controllers/Category/updateCategory');

const router = express.Router();

// Route to create a category
router.post('/categoryRegister', createCategory);

router.put('/updateCategory/:id', updateCategory);

// Route to get all categories
router.get('/getCategory', getAllCategories); // Ensure the function is correctly imported and used


module.exports = router;
