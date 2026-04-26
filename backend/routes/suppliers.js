const express = require('express');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSuppliers)
  .post(authorize('Admin', 'Purchase'), createSupplier);

router
  .route('/:id')
  .get(getSupplier)
  .put(authorize('Admin', 'Purchase'), updateSupplier)
  .delete(authorize('Admin'), deleteSupplier);

module.exports = router;
