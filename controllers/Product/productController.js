const Product = require('../../models/Product/productModel');

// exports.createProduct = async (req, res) => {
//   try {
//     const { title, description, price, stock, subcategory } = req.body;

//     // Check if a product with the same title already exists
//     const existingProduct = await Product.findOne({ title });
//     if (existingProduct) {
//       return res.status(400).json({ message: 'Product title must be unique' });
//     }

//     // Function to get first two uppercase letters from a word
//     const getFirstTwoLetters = (str) => {
//       return str.split(' ').slice(0, 2).join('').substring(0, 2).toUpperCase();
//     };

//     // Get first two letters from title and subcategory
//     const titlePart = getFirstTwoLetters(title);
//     const subcategoryPart = getFirstTwoLetters(subcategory);

//     // Generate a 4-digit random number
//     const randomDigits = Math.floor(Math.random() * 9000) + 1000;  // 4 random digits (1000-9999)

//     // Combine to form productId in the format: TEHO506
//     const productId = `${titlePart}${subcategoryPart}${randomDigits}`;

//     const productImage = req.file ? req.file.path : null;

//     // Create a new product instance
//     const newProduct = new Product({
//       title,
//       description,
//       price,
//       stock,
//       productImage,
//       subcategory,
//       productId
//     });

//     // Save the product
//     const savedProduct = await newProduct.save();

//     // Respond with the created product
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     if (error.code === 11000) {  // MongoDB duplicate key error code
//       return res.status(400).json({ message: 'Product title must be unique' });
//     }
//     console.error('Error creating product:', error);
//     res.status(400).json({ message: 'Error creating product', error: error.message });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, subcategory } = req.body;

    // Check if a product with the same title exists in the same subcategory
    const existingProduct = await Product.findOne({ title, subcategory });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Product title must be unique within the same subcategory',
      });
    }

    // Function to get the first two uppercase letters from a word
    const getFirstTwoLetters = (str) => {
      return str.split(' ').slice(0, 2).map(word => word[0]).join('').substring(0, 2).toUpperCase();
    };

    // Get the first two letters from title and subcategory
    const titlePart = getFirstTwoLetters(title);
    const subcategoryPart = getFirstTwoLetters(subcategory);

    // Generate a 4-digit random number
    const randomDigits = Math.floor(Math.random() * 9000) + 1000;  // Range: 1000-9999

    // Combine to form productId in the format: TEHO5067
    const productId = `${titlePart}${subcategoryPart}${randomDigits}`;

    const productImage = req.file ? req.file.path : null;

    // Create a new product instance
    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      productImage,
      subcategory,
      productId,
    });

    // Save the product
    const savedProduct = await newProduct.save();

    // Respond with the created product
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {  // MongoDB duplicate key error code
      return res.status(400).json({ message: 'Duplicate key error' });
    }
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
    res.status(500).json({ message: 'Error fetching products', error });
  }
};
