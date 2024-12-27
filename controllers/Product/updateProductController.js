const Product = require('../../models/Product/productModel'); // Adjust path as needed

// exports.updateProduct = async (req, res) => {
//     try {
//         const { title, description, price, stock, subcategory } = req.body;
//         const productId = req.params.id;

//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         // Check if product image is uploaded
//         if (req.files) {
//             const productImageFile = req.files.find(f => f.fieldname === 'productImage');
//             if (productImageFile) product.productImage = productImageFile.path;
//         }

//         product.title = title || product.title;
//         product.description = description || product.description;
//         product.price = price || product.price;
//         product.stock = stock || product.stock;
//         product.subcategory = subcategory || product.subcategory;


//         product.isActive = stock === 0 ? false : req.body.isActive ?? product.isActive;

//         const updatedProduct = await product.save();
//         res.status(200).json(updatedProduct);
//     } catch (error) {
//         console.error('Error updating product:', error);
//         res.status(400).json({
//             message: 'Error updating product',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// };

// exports.updateProduct = async (req, res) => {
//     try {
//       const { title, description, price, stock, subcategory } = req.body;
//       const productId = req.params.id;
  
//       const product = await Product.findById(productId);
//       if (!product) return res.status(404).json({ message: 'Product not found' });
  
//       // Ensure stock is not less than 0
//       if (stock < 0) {
//         return res.status(400).json({ message: 'Stock cannot be less than 0.' });
//       }
  
//       // Automatically set isActive to false if stock is 1
//       let isActive = req.body.isActive ?? product.isActive; // Preserve existing isActive if not provided
//       if (stock === 1) {
//         isActive = false;
//       }
  
//       // Check if product image is uploaded
//       if (req.files) {
//         const productImageFile = req.files.find(f => f.fieldname === 'productImage');
//         if (productImageFile) product.productImage = productImageFile.path;
//       }
  
//       // Update product fields
//       product.title = title || product.title;
//       product.description = description || product.description;
//       product.price = price || product.price;
//       product.stock = stock || product.stock;
//       product.subcategory = subcategory || product.subcategory;
//       product.isActive = isActive;
  
//       const updatedProduct = await product.save();
//       res.status(200).json(updatedProduct);
//     } catch (error) {
//       console.error('Error updating product:', error);
//       res.status(400).json({
//         message: 'Error updating product',
//         error: error.message,
//         stack: error.stack
//       });
//     }
//   };
  

exports.updateProduct = async (req, res) => {
    try {
      const { title, description, price, stock, subcategory } = req.body;
      const productId = req.params.id;
  
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      // Ensure stock is not less than 0
      if (stock < 0) {
        return res.status(400).json({ message: 'Stock cannot be less than 0.' });
      }
  
      // Set isActive based on stock value
      let isActive = req.body.isActive ?? product.isActive; // Preserve existing isActive if not provided
      if (stock <= 1) {
        isActive = false;
      } else {
        isActive = true; // Automatically set isActive to true if stock is greater than 1
      }
  
      // Check if product image is uploaded
      if (req.files) {
        const productImageFile = req.files.find(f => f.fieldname === 'productImage');
        if (productImageFile) product.productImage = productImageFile.path;
      }
  
      // Update product fields
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.subcategory = subcategory || product.subcategory;
      product.isActive = isActive;
  
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(400).json({
        message: 'Error updating product',
        error: error.message,
        stack: error.stack
      });
    }
  };
  
