const Product = require('../../models/Product/productModel'); // Adjust path as needed

exports.updateProduct = async (req, res) => {
    try {
        const { title, description, price, stock, subcategory } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if product image is uploaded
        if (req.files) {
            const productImageFile = req.files.find(f => f.fieldname === 'productImage');
            if (productImageFile) product.productImage = productImageFile.path;
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.subcategory = subcategory || product.subcategory;

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
