const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
exports.getPurchaseOrders = async (req, res, next) => {
  try {
    const purchaseOrders = await PurchaseOrder.find()
      .populate('supplier', 'name email contactPhone')
      .populate('products.product', 'title sku');
      
    res.json({ success: true, data: purchaseOrders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single purchase order
// @route   GET /api/purchase-orders/:id
// @access  Private
exports.getPurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)
      .populate('supplier', 'name email contactPhone address')
      .populate('products.product', 'title sku price');

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    res.json({ success: true, data: purchaseOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new purchase order
// @route   POST /api/purchase-orders
// @access  Private
exports.createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplier, products } = req.body;

    let totalPrice = 0;
    
    // Calculate total price 
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      
      // Assume PO price is negotiated and sent in body, but for simplicity here we use existing price if not provided
      if (!item.price) {
        item.price = product.price;
      }
      totalPrice += item.price * item.quantity;
    }

    const purchaseOrder = await PurchaseOrder.create({
      supplier,
      products,
      totalPrice,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: purchaseOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Update purchase order status
// @route   PUT /api/purchase-orders/:id/status
// @access  Private
exports.updatePurchaseOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    purchaseOrder.status = status;
    await purchaseOrder.save();

    res.json({ success: true, data: purchaseOrder });
  } catch (error) {
    next(error);
  }
};
