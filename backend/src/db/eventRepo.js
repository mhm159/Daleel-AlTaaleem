/**
 * Events repository
 */
const { db, newId } = require('./index');

const eventRepo = {
  create(data) {
    const id = newId();
    db.prepare(`
      INSERT INTO events (id, title, description, date, endDate, startTime, endTime, location, category, image, isRecurring, recurrenceRule, status, organizer, contactInfo, capacity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.title, data.description || null, data.date, data.endDate || null,
      data.startTime || null, data.endTime || null, data.location || null, data.category || 'general',
      data.image || null, data.isRecurring ? 1 : 0, data.recurrenceRule || null,
      data.status || 'upcoming', data.organizer || null, data.contactInfo || null, data.capacity || null
    );
    return this.findById(id);
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare(`
      UPDATE events SET title = ?, description = ?, date = ?, endDate = ?, startTime = ?, endTime = ?,
      location = ?, category = ?, image = ?, isRecurring = ?, recurrenceRule = ?, status = ?, organizer = ?, contactInfo = ?, capacity = ?
      WHERE id = ?
    `).run(
      data.title || current.title, data.description !== undefined ? data.description : current.description,
      data.date || current.date, data.endDate !== undefined ? data.endDate : current.endDate,
      data.startTime !== undefined ? data.startTime : current.startTime, data.endTime !== undefined ? data.endTime : current.endTime,
      data.location !== undefined ? data.location : current.location, data.category || current.category,
      data.image !== undefined ? data.image : current.image, data.isRecurring !== undefined ? (data.isRecurring ? 1 : 0) : current.isRecurring,
      data.recurrenceRule !== undefined ? data.recurrenceRule : current.recurrenceRule, data.status || current.status,
      data.organizer !== undefined ? data.organizer : current.organizer, data.contactInfo !== undefined ? data.contactInfo : current.contactInfo,
      data.capacity !== undefined ? data.capacity : current.capacity, id
    );
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  },

  list({ status, category, limit = 10, offset = 0, upcomingOnly = false } = {}) {
    let where = '1=1';
    const params = [];
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (category) { where += ' AND category = ?'; params.push(category); }
    if (upcomingOnly) { where += ' AND date >= ?'; params.push(new Date().toISOString()); }

    const rows = db.prepare(`SELECT * FROM events WHERE ${where} ORDER BY date ASC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM events WHERE ${where}`).get(...params).c;
    return { events: rows, total };
  },

  updateStatus(id, status) {
    db.prepare('UPDATE events SET status = ? WHERE id = ?').run(status, id);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM events WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = eventRepo;
