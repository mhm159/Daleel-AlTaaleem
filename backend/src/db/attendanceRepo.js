/**
 * Attendance repository
 */
const { db, newId } = require('./index');

const attendanceRepo = {
  create({ studentId, date, status, reason, notes, recordedBy, checkInTime, checkOutTime }) {
    // Upsert
    const existing = db.prepare('SELECT id FROM attendance WHERE studentId = ? AND date = ?').get(studentId, date);
    if (existing) {
      db.prepare('UPDATE attendance SET status = ?, reason = ?, notes = ?, recordedBy = ?, checkInTime = ?, checkOutTime = ? WHERE id = ?')
        .run(status, reason || null, notes || null, recordedBy || null, checkInTime || null, checkOutTime || null, existing.id);
      return this.findById(existing.id);
    }
    const id = newId();
    db.prepare(`
      INSERT INTO attendance (id, studentId, date, status, reason, notes, recordedBy, checkInTime, checkOutTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, date, status, reason || null, notes || null, recordedBy || null, checkInTime || null, checkOutTime || null);
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);
  },

  listByStudent(studentId, { startDate, endDate, limit = 30, offset = 0 } = {}) {
    let where = 'studentId = ?';
    const params = [studentId];
    if (startDate || endDate) {
      where += ' AND date BETWEEN ? AND ?';
      params.push(startDate || '1970-01-01', endDate || '2100-01-01');
    }
    const rows = db.prepare(`SELECT * FROM attendance WHERE ${where} ORDER BY date DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM attendance WHERE ${where}`).get(...params).c;
    return { attendance: rows, total };
  },

  listByStudents(studentIds, { startDate, endDate } = {}) {
    if (!studentIds.length) return [];
    const placeholders = studentIds.map(() => '?').join(',');
    let where = `studentId IN (${placeholders})`;
    const params = [...studentIds];
    if (startDate || endDate) {
      where += ' AND date BETWEEN ? AND ?';
      params.push(startDate || '1970-01-01', endDate || '2100-01-01');
    }
    return db.prepare(`SELECT * FROM attendance WHERE ${where} ORDER BY date DESC`).all(...params);
  },

  summary(studentId) {
    const rows = db.prepare('SELECT status, COUNT(*) as c FROM attendance WHERE studentId = ? GROUP BY status').all(studentId);
    const summary = { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    rows.forEach(r => { summary[r.status] = r.c; summary.total += r.c; });
    return summary;
  },

  update(id, data) {
    db.prepare('UPDATE attendance SET status = ?, reason = ?, notes = ? WHERE id = ?')
      .run(data.status, data.reason || null, data.notes || null, id);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM attendance WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = attendanceRepo;
