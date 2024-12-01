const mongoose = require('mongoose');

// Category schema definition
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subCategories: {
    type: String,
    required: true,
    unique: true,
  },
  collections: {
    type: String,
    required: false,
  },
  vendorCount: {
    type: Number,
    default: 0,  // Default vendor count is 0
  },
}, {
  timestamps: true,
});

// Create Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
