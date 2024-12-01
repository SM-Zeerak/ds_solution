const express = require('express');
const { createProduct, getAllProducts } = require('../../controllers/Product/productController');
const { updateProduct } = require('../../controllers/Product/updateProductController');
// const upload = require('../../services/Product/upload');
const { upload, setRelativePath } = require('../../services/Product/upload');


const router = express.Router();

router.post(
    '/productsRegister',
    upload.single('productImage'),  // Handle file upload
    setRelativePath,               // Set the relative path for productImage
    createProduct                  // Continue with product creation logic
  );


router.get('/getProducts', getAllProducts);


router.put(
    '/productProfileUpdate/:id', // Remove /api/products if you're already using it in app.js
    upload.single('productImage'),
    updateProduct
  );
  
module.exports = router;
