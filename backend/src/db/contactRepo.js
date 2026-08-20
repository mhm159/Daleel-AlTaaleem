/**
 * Contact messages repository
 */
const { db, newId } = require('./index');

const contactRepo = {
  create({ name, email, phone, subject, message, category = 'general' }) {
    const id = newId();
    db.prepare(`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
    `).run(id, name, email, phone || null, subject, message, category);
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id);
  },

  list({ status, category, limit = 20, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (category) { where += ' AND category = ?'; params.push(category); }
    const rows = db.prepare(`SELECT * FROM contact_messages WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const summary = {
      new: db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'new'").get().c,
      read: db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'read'").get().c,
      replied: db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'replied'").get().c,
      closed: db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'closed'").get().c,
    };
    const total = db.prepare(`SELECT COUNT(*) as c FROM contact_messages WHERE ${where}`).get(...params).c;
    return { contacts: rows, summary, total };
  },

  update(id, { status, replyContent }) {
    const current = this.findById(id);
    if (!current) return null;
    const repliedAt = status === 'replied' ? new Date().toISOString() : current.repliedAt;
    db.prepare('UPDATE contact_messages SET status = ?, replyContent = ?, repliedAt = ? WHERE id = ?')
      .run(status || current.status, replyContent !== undefined ? replyContent : current.replyContent, repliedAt, id);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = contactRepo;
