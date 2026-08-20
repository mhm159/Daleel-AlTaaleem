/**
 * User repository — SQLite queries for users & children
 */
const { db, rowToUser, newId } = require('../db');

const userRepo = {
  create({ email, password, name, phone, role = 'parent', address, profilePhoto, children = [] }) {
    const id = newId();
    db.prepare(`
      INSERT INTO users (id, email, password, name, phone, role, address, profilePhoto, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(id, email.toLowerCase(), password, name, phone || null, role, address || null, profilePhoto || null);

    // Link children
    const link = db.prepare('INSERT OR IGNORE INTO user_children (userId, studentId, relationship) VALUES (?, ?, ?)');
    children.forEach(c => link.run(id, c.studentId, c.relationship || 'parent'));

    return this.findById(id);
  },

  findByEmail(email) {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    return rowToUser(row);
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return rowToUser(row);
  },

  update(id, { name, phone, address, profilePhoto, role, isActive }) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare(`
      UPDATE users SET name = ?, phone = ?, address = ?, profilePhoto = ?,
      role = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || current.name,
      phone !== undefined ? phone : current.phone,
      address !== undefined ? address : current.address,
      profilePhoto !== undefined ? profilePhoto : current.profilePhoto,
      role || current.role,
      isActive !== undefined ? (isActive ? 1 : 0) : (current.isActive ? 1 : 0),
      id
    );
    return this.findById(id);
  },

  updateLastLogin() {},
  setLastLogin(id) {
    db.prepare('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  },

  list({ role, search, limit = 20, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (role) { where += ' AND role = ?'; params.push(role); }
    if (search) { where += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    const rows = db.prepare(`SELECT * FROM users WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM users WHERE ${where}`).get(...params).c;
    return { users: rows.map(rowToUser), total };
  },

  delete(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id).changes > 0;
  },

  hardDelete(id) {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM user_children WHERE userId = ?').run(id);
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
    });
    tx();
  },
};

module.exports = userRepo;
