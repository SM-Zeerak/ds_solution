const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { // 'deposit' or 'withdrawal'
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: { // 'Cash' or 'Online' for deposits
    type: String,
    enum: ['Cash', 'Online', 'Wallet', 'Receivable'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  balanceAfterTransaction: {
    type: Number, // Store the balance after transaction
    required: true,
  },
  senderId: {
    type: String,
    required: false, // Optional, in case of transfer
  },
  receiverId: {
    type: String,
    required: false, // Optional, in case of transfer
  },
  senderName: {
    type: String,
    required: false, // Optional, in case of transfer
  },
  receiverName: {
    type: String,
    required: false, // Optional, in case of transfer
  },
  userId: { // Store the userId who sent the payment
    type: String,
    required: false,
  }
});


const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cashBalance: {
    type: Number,
    default: 0,
  },
  onlineBalance: {
    type: Number,
    default: 0,
  },
  userType: {
    type: String,
    enum: ['user', 'vendor', 'team', 'admin'],
    required: true,
  },
  payableAmount: {
    type: Number,
    default: 0,
  }, // Amount to be paid (negative in user wallet)
  TotalreceivableAmount: { 
    type: Number, 
    default: 0, 
  }, // 

  receivables: [ // New array to track receivable amounts
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductOrder', required: true, unique: true },
      totalAmount: { type: Number, required: true },
      userId: { type: String, required: true }, // User who is expected to make the payment
      receivableAmount: { type: Number, required: true },
      balanceAmount: { type: Number, required: true }

    }
  ],
  transactions: [transactionSchema], // Add transaction history
}, {
  timestamps: true,
});

// Create Wallet model
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
