const mongoose = require('mongoose');
const Category = require('../../models/Category/categoryModel');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    unique: true
  },
  productId: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false,
  },
  oldPrice: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    default: 0,
  },
  productImage: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
