const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
exports.getSuppliers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Supplier.countDocuments(query);
    const suppliers = await Supplier.find(query).skip(startIndex).limit(limit);

    res.json({
      success: true,
      count: suppliers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: suppliers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
exports.getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
exports.createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
exports.updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
exports.deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
