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
    default: 0
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
    default: 1,
  },
  productImage: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productType: {
    type: String,
    enum: ['Price', 'OnVisit'],
    required: true,
  },

}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
