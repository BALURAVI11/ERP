const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  salesOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
