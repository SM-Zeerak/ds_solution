const Product = require('../../models/Product/productModel');

exports.updateIsActive = async (req, res) => {
    try {
        const productId = req.params.id;
        const { isActive } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.isActive = isActive;
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating isActive:', error);
        res.status(400).json({
            message: 'Error updating isActive',
            error: error.message,
        });
    }
};