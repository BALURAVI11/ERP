const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getProducts)
  .post(protect, authorize('Admin', 'Inventory'), createProduct);

router
  .route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('Admin', 'Inventory'), updateProduct)
  .delete(protect, authorize('Admin'), deleteProduct);

module.exports = router;
