const express = require('express');
const {
  getSalesOrders,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrderStatus
} = require('../controllers/salesOrderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSalesOrders)
  .post(authorize('Admin', 'Sales'), createSalesOrder);

router
  .route('/:id')
  .get(getSalesOrder);

router
  .route('/:id/status')
  .put(authorize('Admin', 'Sales'), updateSalesOrderStatus);

module.exports = router;
