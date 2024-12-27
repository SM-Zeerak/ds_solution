const Product = require('../../models/Product/productModel');
const fs = require('fs');  // Importing fs for file operations
const path = require('path');

// Create a new product
// exports.createProduct = async (req, res) => {
//   try {
//     const { title, description, price, stock, subcategory } = req.body;

//     if (stock <= 0) {
//       return res.status(400).json({
//         message: 'Stock must be greater than 0.',
//       });
//     }

//     // Check for existing product
//     const existingProduct = await Product.findOne({ title, subcategory });
//     if (existingProduct) {
//       return res.status(400).json({
//         message: 'Product title must be unique within the same subcategory',
//       });
//     }

//     // Generate productId
//     const getFirstTwoLetters = (str) =>
//       str
//         .split(' ')
//         .slice(0, 2)
//         .map((word) => word[0])
//         .join('')
//         .substring(0, 2)
//         .toUpperCase();
//     const titlePart = getFirstTwoLetters(title);
//     const subcategoryPart = getFirstTwoLetters(subcategory);
//     const randomDigits = Math.floor(1000 + Math.random() * 9000);
//     const productId = `${titlePart}${subcategoryPart}${randomDigits}`;

//     // Image upload directory
//     const uploadDir = path.join(__dirname, '../../public/uploads/Product', productId);
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     // Move files to productId directory
//     await Promise.all(
//       req.files.map(async (file) => {
//         const tempPath = path.join(__dirname, '../../public', file.path); // Correct temp path
//         const fileName = path.basename(tempPath);
//         const targetPath = path.join(uploadDir, fileName);

//         // Move file
//         fs.renameSync(tempPath, targetPath);
//         file.path = `/uploads/Product/${productId}/${fileName}`;

//         // Check and delete temp file (double-checking)
//         if (fs.existsSync(tempPath)) {
//           fs.unlinkSync(tempPath);
//         }
//       })
//     );

//     // Save product
//     const newProduct = new Product({
//       title,
//       description,
//       price,
//       stock,
//       productImage: req.files?.[0]?.path,
//       subcategory,
//       productId,
//       isActive: stock > 0
//     });
//     const savedProduct = await newProduct.save();
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(400).json({ message: 'Error creating product', error: error.message });
//   }
// };


// exports.createProduct = async (req, res) => {
//   try {
//     const { title, description, price, stock, subcategory, productType } = req.body;

//     // Validate product type
//     if (!['Price', 'OnVisit'].includes(productType)) {
//       return res.status(400).json({
//         message: 'Invalid product type. Must be either "Price" or "OnVisit".',
//       });
//     }

//     // Enforce price rules based on product type
//     if (productType === 'OnVisit' && price !== 0) {
//       return res.status(400).json({
//         message: 'Price must be 0 for products with type "OnVisit".',
//       });
//     }
//     if (productType === 'Price' && (price === undefined || price <= 0)) {
//       return res.status(400).json({
//         message: 'Price must be greater than 0 for products with type "Price".',
//       });
//     }

//     // Check for stock validity
//     if (stock <= 0) {
//       return res.status(400).json({
//         message: 'Stock must be greater than 0.',
//       });
//     }

//     // Check for existing product
//     const existingProduct = await Product.findOne({ title, subcategory });
//     if (existingProduct) {
//       return res.status(400).json({
//         message: 'Product title must be unique within the same subcategory',
//       });
//     }

//     // Generate productId
//     const getFirstTwoLetters = (str) =>
//       str
//         .split(' ')
//         .slice(0, 2)
//         .map((word) => word[0])
//         .join('')
//         .substring(0, 2)
//         .toUpperCase();
//     const titlePart = getFirstTwoLetters(title);
//     const subcategoryPart = getFirstTwoLetters(subcategory);
//     const randomDigits = Math.floor(1000 + Math.random() * 9000);
//     const productId = `${titlePart}${subcategoryPart}${randomDigits}`;

//     // Image upload directory
//     const uploadDir = path.join(__dirname, '../../public/uploads/Product', productId);
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     // Move files to productId directory
//     await Promise.all(
//       req.files.map(async (file) => {
//         const tempPath = path.join(__dirname, '../../public', file.path); // Correct temp path
//         const fileName = path.basename(tempPath);
//         const targetPath = path.join(uploadDir, fileName);

//         // Move file
//         fs.renameSync(tempPath, targetPath);
//         file.path = `/uploads/Product/${productId}/${fileName}`;

//         // Check and delete temp file (double-checking)
//         if (fs.existsSync(tempPath)) {
//           fs.unlinkSync(tempPath);
//         }
//       })
//     );

//     // Save product
//     const newProduct = new Product({
//       title,
//       description,
//       price: productType === 'OnVisit' ? 0 : price,
//       stock,
//       productImage: req.files?.[0]?.path,
//       subcategory,
//       productId,
//       productType,
//       isActive: stock > 0,
//     });
//     const savedProduct = await newProduct.save();
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(400).json({ message: 'Error creating product', error: error.message });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, subcategory, productType } = req.body;

    console.log('Received productType:', productType); 

    // Validate product type
    if (!['Price', 'OnVisit'].includes(productType)) {
      return res.status(400).json({
        message: 'Invalid product type. Must be either "Price" or "OnVisit".',
      });
    }

    // Enforce stock validity
    if (stock <= 0) {
      return res.status(400).json({
        message: 'Stock must be greater than 0.',
      });
    }

    // Automatically set price to 0 for "OnVisit" products
    const adjustedPrice = productType === 'OnVisit' ? 0 : price;

    // Validate adjusted price for "Price" type
    if (productType === 'Price' && (adjustedPrice === undefined || adjustedPrice <= 0)) {
      return res.status(400).json({
        message: 'Price must be greater than 0 for products with type "Price".',
      });
    }

    // Check for existing product
    const existingProduct = await Product.findOne({ title, subcategory });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Product title must be unique within the same subcategory',
      });
    }

    // Generate productId
    const getFirstTwoLetters = (str) =>
      str
        .split(' ')  // Split by spaces
        .map((word) => word[0]) // Take the first letter of each word
        .join('') // Join them back together
        .substring(0, 2) // Ensure it takes the first two characters
        .toUpperCase(); // Convert to uppercase
    const titlePart = getFirstTwoLetters(title);
    const subcategoryPart = getFirstTwoLetters(subcategory);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const productId = `${titlePart}${subcategoryPart}${randomDigits}`;

    console.log('Generated productId:', productId);

    // Image upload directory
    const uploadDir = path.join(__dirname, '../../public/uploads/Product', productId);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Move files to productId directory
    await Promise.all(
      req.files.map(async (file) => {
        const tempPath = path.join(__dirname, '../../public', file.path); // Correct temp path
        const fileName = path.basename(tempPath);
        const targetPath = path.join(uploadDir, fileName);

        // Move file
        fs.renameSync(tempPath, targetPath);
        file.path = `/uploads/Product/${productId}/${fileName}`;

        // Check and delete temp file (double-checking)
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      })
    );

    // Save product
    const newProduct = new Product({
      title,
      description,
      price: adjustedPrice, // Use adjusted price here
      stock,
      productImage: req.files?.[0]?.path,
      subcategory,
      productId,
      productType,
      isActive: stock > 0,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};


// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { subcategory, isActive } = req.query;

    // Create a filter object
    const filter = {};
    if (subcategory) filter.subcategory = subcategory;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Fetch products based on filter
    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};



