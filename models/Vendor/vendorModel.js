// models/vendorModel.js
const mongoose = require('mongoose');
const Category = require('../../models/Category/categoryModel');

const vendorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  cnic: {
    type: String,
    required: false,
  },
  adress: {
    type: String,
    required: false,
  },
  aow: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  cnicImage: {
    type: String,
    required: false,
  },
  vendorId: {
    type: String,
    required: false,
  },
  teamId: {
    type: String,
    required: false,
  },
  profession: {
    type: [String], // Array of strings to store profession names
    required: true
  },

}, {
  timestamps: true,
});

const vendor = mongoose.model('Vendor', vendorSchema ,);
module.exports = vendor;
