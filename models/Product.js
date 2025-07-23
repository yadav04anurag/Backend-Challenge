const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product must belong to a seller']
  },
  height: {
    type: Number,
    required: [true, 'Please provide height of the suitcase'],
    min: [1, 'Height must be at least 1']
  },
  width: {
    type: Number,
    required: [true, 'Please provide width of the suitcase'],
    min: [1, 'Width must be at least 1']
  },
  material: {
    type: String,
    required: [true, 'Please provide material of the suitcase'],
    enum: ['leather', 'polycarbonate', 'aluminum', 'nylon', 'polyester']
  },
  rate: {
    type: Number,
    required: [true, 'Please provide rate of the suitcase'],
    min: [0, 'Rate cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  isSold: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };