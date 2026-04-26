const Invoice = require('../models/Invoice');
const SalesOrder = require('../models/SalesOrder');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: 'salesOrder',
        populate: {
          path: 'customer',
          select: 'name email'
        }
      });
      
    res.json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: 'salesOrder',
        populate: {
          path: 'customer',
          select: 'name email address contactPhone'
        }
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private (Sales, Admin)
exports.createInvoice = async (req, res, next) => {
  try {
    const { salesOrder, dueDate } = req.body;

    const so = await SalesOrder.findById(salesOrder);
    if (!so) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }

    const invoice = await Invoice.create({
      salesOrder,
      amount: so.totalPrice,
      dueDate,
      status: 'Unpaid'
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice status
// @route   PUT /api/invoices/:id/status
// @access  Private (Sales, Admin)
exports.updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.status = status;
    await invoice.save();

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};
