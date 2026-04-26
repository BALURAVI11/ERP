const GRN = require('../models/GRN');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');

// @desc    Get all GRNs
// @route   GET /api/grns
// @access  Private
exports.getGRNs = async (req, res, next) => {
  try {
    const grns = await GRN.find()
      .populate('purchaseOrder')
      .populate('receivedItems.product', 'title sku');
      
    res.json({ success: true, data: grns });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single GRN
// @route   GET /api/grns/:id
// @access  Private
exports.getGRN = async (req, res, next) => {
  try {
    const grn = await GRN.findById(req.params.id)
      .populate('purchaseOrder')
      .populate('receivedItems.product', 'title sku');

    if (!grn) {
      return res.status(404).json({ message: 'GRN not found' });
    }

    res.json({ success: true, data: grn });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new GRN
// @route   POST /api/grns
// @access  Private (Inventory)
exports.createGRN = async (req, res, next) => {
  try {
    const { purchaseOrder, receivedItems, status } = req.body;

    const po = await PurchaseOrder.findById(purchaseOrder);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    const grn = await GRN.create({
      purchaseOrder,
      receivedItems,
      status
    });

    // Update Product Stock based on GRN
    for (const item of receivedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantityReceived }
      });
    }

    // Optionally update Purchase Order status
    po.status = 'Received';
    await po.save();

    res.status(201).json({ success: true, data: grn });
  } catch (error) {
    next(error);
  }
};
