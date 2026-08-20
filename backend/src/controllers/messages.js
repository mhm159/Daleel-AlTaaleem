const messageRepo = require('../db/messageRepo');
const userRepo = require('../db/userRepo');

exports.conversations = async (req, res) => {
  try {
    const conversations = messageRepo.listConversations(req.user.id);
    // Enrich with names
    const enriched = conversations.map(c => {
      const other = userRepo.findById(c.otherUserId);
      return { ...c, withUser: other ? { id: other.id, name: other.name, profilePhoto: other.profilePhoto, role: other.role } : null };
    });
    res.json({ success: true, conversations: enriched, pagination: { total: enriched.length, pages: 1, page: 1, limit: enriched.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching conversations' });
  }
};

exports.messages = async (req, res) => {
  try {
    const { studentId, limit = 50, offset = 0 } = req.query;
    const messages = messageRepo.listByConversation(req.user.id, { studentId: studentId || undefined, limit: parseInt(limit), offset: parseInt(offset) });
    const enriched = messages.map(m => {
      const sender = userRepo.findById(m.senderId);
      const receiver = userRepo.findById(m.receiverId);
      return { ...m, senderName: sender?.name, receiverName: receiver?.name, senderProfilePhoto: sender?.profilePhoto };
    });
    res.json({ success: true, messages: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
};

exports.send = async (req, res) => {
  try {
    const { receiverId, studentId, subject, content, isReply, conversationId, attachments } = req.body;
    const receiver = userRepo.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: 'Recipient not found' });
    if (studentId && req.user.role === 'parent' && !req.user.children.some(c => c.studentId === studentId)) {
      return res.status(403).json({ success: false, message: 'Access denied to this student' });
    }
    const message = messageRepo.create({ senderId: req.user.id, receiverId, studentId, subject, content, isReply: !!isReply, conversationId, attachments: attachments || [] });
    const sender = userRepo.findById(req.user.id);
    const receiverU = userRepo.findById(receiverId);
    res.status(201).json({
      success: true,
      message: { ...message, senderName: sender?.name, receiverName: receiverU?.name, senderProfilePhoto: sender?.profilePhoto },
    });
  } catch (err) {
    console.error('Message send error:', err);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};

exports.unreadCount = async (req, res) => {
  try {
    res.json({ success: true, unreadCount: messageRepo.unreadCount(req.user.id) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching unread count' });
  }
};
