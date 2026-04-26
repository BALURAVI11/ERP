const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');

// @desc    Get all sales orders
// @route   GET /api/sales-orders
// @access  Private
exports.getSalesOrders = async (req, res, next) => {
  try {
    const salesOrders = await SalesOrder.find()
      .populate('customer', 'name email contactPhone')
      .populate('products.product', 'title sku');
      
    res.json({ success: true, data: salesOrders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sales order
// @route   GET /api/sales-orders/:id
// @access  Private
exports.getSalesOrder = async (req, res, next) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id)
      .populate('customer', 'name email contactPhone address')
      .populate('products.product', 'title sku price');

    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }

    res.json({ success: true, data: salesOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new sales order
// @route   POST /api/sales-orders
// @access  Private
exports.createSalesOrder = async (req, res, next) => {
  try {
    const { customer, products } = req.body;

    let totalPrice = 0;
    
    // Calculate total price and check stock (simple version)
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }
      
      // We assume price is sent in the body or fetched from DB. Let's use DB price for security.
      item.price = product.price;
      totalPrice += product.price * item.quantity;
    }

    const salesOrder = await SalesOrder.create({
      customer,
      products,
      totalPrice,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: salesOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sales order status
// @route   PUT /api/sales-orders/:id/status
// @access  Private
exports.updateSalesOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const salesOrder = await SalesOrder.findById(req.params.id);

    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }

    // If order is completed, reduce stock
    if (status === 'Completed' && salesOrder.status !== 'Completed') {
      for (const item of salesOrder.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    salesOrder.status = status;
    await salesOrder.save();

    res.json({ success: true, data: salesOrder });
  } catch (error) {
    next(error);
  }
};
