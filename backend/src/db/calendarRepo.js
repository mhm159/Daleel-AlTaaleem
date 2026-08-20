/**
 * Academic Calendar repository
 */
const { db, newId } = require('./index');

const calendarRepo = {
  create({ title, startDate, endDate, description, type = 'event', color = '#0ea5e9', isAllDay = true, gradeLevel }) {
    const id = newId();
    db.prepare(`
      INSERT INTO academic_calendar (id, title, startDate, endDate, description, type, color, isAllDay, gradeLevel)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, startDate, endDate || startDate, description || null, type, color, isAllDay ? 1 : 0, gradeLevel || null);
    return this.findById(id);
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare(`
      UPDATE academic_calendar SET title = ?, startDate = ?, endDate = ?, description = ?, type = ?, color = ?, isAllDay = ?, gradeLevel = ?
      WHERE id = ?
    `).run(
      data.title || current.title, data.startDate || current.startDate, data.endDate || current.endDate,
      data.description !== undefined ? data.description : current.description, data.type || current.type,
      data.color || current.color, data.isAllDay !== undefined ? (data.isAllDay ? 1 : 0) : current.isAllDay,
      data.gradeLevel !== undefined ? data.gradeLevel : current.gradeLevel, id
    );
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM academic_calendar WHERE id = ?').get(id);
  },

  list({ startDate, endDate, type, gradeLevel, limit = 50, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (startDate || endDate) {
      where += ' AND startDate BETWEEN ? AND ?';
      params.push(startDate || '1970-01-01', endDate || '2100-01-01');
    }
    if (type) { where += ' AND type = ?'; params.push(type); }
    if (gradeLevel) { where += ' AND (gradeLevel = ? OR gradeLevel = "all" OR gradeLevel IS NULL)'; params.push(gradeLevel); }

    const rows = db.prepare(`SELECT * FROM academic_calendar WHERE ${where} ORDER BY startDate ASC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM academic_calendar WHERE ${where}`).get(...params).c;
    return { events: rows, total };
  },

  delete(id) {
    return db.prepare('DELETE FROM academic_calendar WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = calendarRepo;
