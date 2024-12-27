const mongoose = require('mongoose');

// ProductOrder schema definition
const productOrderSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: false,
  },
  transactions: [{
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'status update'],  // Define types of transactions
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Online'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    balanceAfterTransaction: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  vendorId: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,  // Default to 0 for Receivable orders
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  verified: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online', 'Receivable'],
    required: false,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  installmentDuration: {  // Add installmentDuration for Receivable orders
    type: Number,
    required: false,  // Not required unless payment method is Receivable
  },
  orderType: {  // Add orderType to distinguish between urgent and receivable orders
    type: String,
    enum: ['urgent', 'receivable'],
    required: false,
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },  // New field for balance
  paymentAmount: {
    type: Number,
    default: 0
  }
  ,  // Track payment
}, {
  timestamps: true,
});

productOrderSchema.pre('save', function(next) {
  if (this.paymentAmount > this.totalAmount) {
    return next(new Error('Payment amount cannot exceed the total amount'));
  }
  next();
});

// Create ProductOrder model
const ProductOrder = mongoose.model('ProductOrder', productOrderSchema);

module.exports = ProductOrder;
