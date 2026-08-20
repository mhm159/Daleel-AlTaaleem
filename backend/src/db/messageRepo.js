/**
 * Messages repository
 */
const { db, newId, parseJson } = require('./index');

const messageRepo = {
  create({ senderId, receiverId, studentId, subject, content, isReply = false, conversationId, attachments = [] }) {
    const id = newId();
    const convId = conversationId || id;
    db.prepare(`
      INSERT INTO messages (id, senderId, receiverId, studentId, subject, content, isRead, isReply, conversationId, attachments)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(id, senderId, receiverId, studentId || null, subject || null, content, isReply ? 1 : 0, convId, JSON.stringify(attachments));
    return this.findById(id);
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    if (!row) return null;
    return { ...row, attachments: parseJson(row.attachments) };
  },

  listConversations(userId) {
    // Get latest message per conversation partner
    const rows = db.prepare(`
      SELECT m.* FROM messages m
      JOIN (
        SELECT MAX(createdAt) as maxCreated, 
               CASE WHEN senderId = ? THEN receiverId ELSE senderId END as otherId,
               COALESCE(studentId, 'none') as studId
        FROM messages
        WHERE senderId = ? OR receiverId = ?
        GROUP BY otherId, studId
      ) latest ON (
        m.createdAt = latest.maxCreated AND
        ((m.senderId = ? AND m.receiverId = latest.otherId) OR (m.receiverId = ? AND m.senderId = latest.otherId)) AND
        COALESCE(m.studentId, 'none') = latest.studId
      )
      ORDER BY m.createdAt DESC
    `).all(userId, userId, userId, userId, userId);

    const conversations = [];
    rows.forEach(m => {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId;
      const unread = db.prepare("SELECT COUNT(*) as c FROM messages WHERE receiverId = ? AND isRead = 0 AND senderId = ?")
        .get(userId, otherId).c;
      conversations.push({
        id: m.conversationId || m.id,
        studentId: m.studentId,
        otherUserId: otherId,
        lastMessage: {
          id: m.id, content: m.content, subject: m.subject,
          isRead: !!m.isRead, createdAt: m.createdAt,
          senderId: m.senderId,
        },
        unreadCount: unread,
      });
    });
    return conversations;
  },

  listByConversation(userId, { studentId, limit = 50, offset = 0 } = {}) {
    let where = '(senderId = ? OR receiverId = ?)';
    const params = [userId, userId];
    if (studentId) { where += ' AND studentId = ?'; params.push(studentId); }
    const rows = db.prepare(`SELECT * FROM messages WHERE ${where} ORDER BY createdAt ASC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    // Mark as read
    db.prepare('UPDATE messages SET isRead = 1 WHERE receiverId = ? AND isRead = 0').run(userId);
    return rows.map(r => ({ ...r, attachments: parseJson(r.attachments) }));
  },

  unreadCount(userId) {
    return db.prepare('SELECT COUNT(*) as c FROM messages WHERE receiverId = ? AND isRead = 0').get(userId).c;
  },

  delete(id) {
    return db.prepare('DELETE FROM messages WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = messageRepo;
