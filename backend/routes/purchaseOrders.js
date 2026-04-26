const express = require('express');
const {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrderStatus
} = require('../controllers/purchaseOrderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPurchaseOrders)
  .post(authorize('Admin', 'Purchase'), createPurchaseOrder);

router
  .route('/:id')
  .get(getPurchaseOrder);

router
  .route('/:id/status')
  .put(authorize('Admin', 'Purchase'), updatePurchaseOrderStatus);

module.exports = router;
