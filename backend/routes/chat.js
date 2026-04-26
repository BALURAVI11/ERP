const express = require('express');
const router = express.Router();
const { processChatMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', protect, processChatMessage);

module.exports = router;
