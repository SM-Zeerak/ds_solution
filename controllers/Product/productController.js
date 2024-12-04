const Product = require('../../models/Product/productModel');
const fs = require('fs');  // Importing fs for file operations
const path = require('path');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, subcategory } = req.body;

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
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    const titlePart = getFirstTwoLetters(title);
    const subcategoryPart = getFirstTwoLetters(subcategory);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const productId = `${titlePart}${subcategoryPart}${randomDigits}`;

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
      price,
      stock,
      productImage: req.files?.[0]?.path,
      subcategory,
      productId,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};
