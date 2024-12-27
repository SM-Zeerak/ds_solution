const express = require('express');
const { createProduct, getAllProducts } = require('../../controllers/Product/productController');
const { updateProduct } = require('../../controllers/Product/updateProductController');
const { updateIsActive } = require('../../controllers/Product/isActiveController');
const { fileUpload } = require('../../services/Product/upload');

const router = express.Router();

// Register a new product with image upload
router.post(
  '/productsRegister',
  fileUpload,      // Handle file upload using multer (supports multiple files if needed)
  createProduct    // Continue with product creation logic
);

// Get all products
router.get('/getProducts', getAllProducts);

// Update an existing product with a new image (if provided)
router.put('/productProfileUpdate/:id', fileUpload, updateProduct);

router.put('/productIsActiveUpdate/:id', updateIsActive);

module.exports = router;
