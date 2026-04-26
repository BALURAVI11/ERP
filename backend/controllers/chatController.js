const aiService = require('../services/aiService');

// @desc    Process a chat message via Smart Assistant
// @route   POST /api/chat
// @access  Private
exports.processChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await aiService.processQuery(message);

    res.json({ success: true, reply });
  } catch (error) {
    if (error.message.includes('GOOGLE_API_KEY is missing')) {
      return res.status(503).json({ message: error.message });
    }
    return res.status(500).json({ message: "AI Engine Error: " + error.message });
  }
};
