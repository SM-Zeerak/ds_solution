const Product = require('../../models/Product/productModel');

// exports.updateProduct = async (req, res) => {
//   try {
//     const { title, description, price, stock } = req.body;
//     const productId = req.params.id;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // If a new product image was uploaded, update the productImage field
//     const productImage = req.file ? `/uploads/products/${req.file.filename}` : product.productImage;

//     product.title = title || product.title;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.stock = stock || product.stock;
//     product.productImage = productImage;

//     const updatedProduct = await product.save();
//     res.status(200).json(updatedProduct); // Send the updated product as response
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating product', error });
//   }
// };


exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, stock, subcategory } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productImage = req.file ? `/uploads/products/${req.file.filename}` : product.productImage;

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.subcategory = subcategory || product.subcategory; // Ensure subcategory is updated
    product.productImage = productImage;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error); // Log the full error for debugging
    res.status(400).json({ 
      message: 'Error updating product', 
      error: error.message || 'Unknown error', // Display the error message
      stack: error.stack // Optionally send the stack trace for debugging
    });
  }
};
