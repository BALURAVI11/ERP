const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCustomers)
  .post(authorize('Admin', 'Sales'), createCustomer);

router
  .route('/:id')
  .get(getCustomer)
  .put(authorize('Admin', 'Sales'), updateCustomer)
  .delete(authorize('Admin'), deleteCustomer);

module.exports = router;
