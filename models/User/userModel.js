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
    required: false,
    unique: true,
    sparse: true,
  },
  cnic: {
    type: String,
    required: false,
  },
  adress: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  walletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wallet', 
    required: false },
}, {
  timestamps: true,
});

const user = mongoose.model('User', userSchema);
module.exports = user;
