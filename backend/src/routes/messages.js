const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');
const { auth } = require('../middleware/auth');

router.get('/conversations', auth, messagesController.conversations);
router.get('/conversation/:conversationId', auth, messagesController.messages);
router.post('/', auth, messagesController.send);
router.get('/unread-count', auth, messagesController.unreadCount);

module.exports = router;
