const express = require('express')
const router  = express.Router()
const { chat, analyseWeakTopics } = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

// temporarily remove protect to test
router.post('/chat',        chat)
router.post('/weak-topics', protect, analyseWeakTopics)

module.exports = router
