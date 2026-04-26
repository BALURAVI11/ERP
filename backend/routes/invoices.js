const express = require('express');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoiceStatus
} = require('../controllers/invoiceController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getInvoices)
  .post(authorize('Admin', 'Sales'), createInvoice);

router
  .route('/:id')
  .get(getInvoice);

router
  .route('/:id/status')
  .put(authorize('Admin', 'Sales'), updateInvoiceStatus);

module.exports = router;
