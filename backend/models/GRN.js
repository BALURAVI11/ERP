const mongoose = require('mongoose');

const grnSchema = new mongoose.Schema({
  purchaseOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: true
  },
  receivedItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantityReceived: {
        type: Number,
        required: true
      }
    }
  ],
  dateReceived: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Partial', 'Complete'],
    default: 'Complete'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GRN', grnSchema);
