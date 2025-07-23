const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a buyer']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Order must have a product']
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: [true, 'Please specify payment method']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };