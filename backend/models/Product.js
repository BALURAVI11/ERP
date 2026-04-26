const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  category: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
