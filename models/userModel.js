// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  }
  
}, {
  timestamps: true,
});

const User = mongoose.model('Vendor', userSchema);
module.exports = User;
