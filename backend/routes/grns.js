const express = require('express');
const {
  getGRNs,
  getGRN,
  createGRN
} = require('../controllers/grnController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getGRNs)
  .post(authorize('Admin', 'Inventory'), createGRN);

router
  .route('/:id')
  .get(getGRN);

module.exports = router;
