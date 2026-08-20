/**
 * Grades repository
 */
const { db, newId } = require('./index');

function letterGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

const gradeRepo = {
  create({ studentId, assignmentName, subject, score, maxScore, weight = 1, type = 'homework', term = 'fall', academicYear, dueDate, feedback, recordedBy, isLate = false }) {
    const id = newId();
    db.prepare(`
      INSERT INTO grades (id, studentId, assignmentName, subject, score, maxScore, weight, type, term, academicYear, dueDate, feedback, recordedBy, isLate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, studentId, assignmentName, subject, score, maxScore, weight, type, term,
      academicYear || String(new Date().getFullYear()), dueDate || null, feedback || null, recordedBy || null, isLate ? 1 : 0);
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM grades WHERE id = ?').get(id);
  },

  listByStudent(studentId, { term, academicYear, subject, limit = 50, offset = 0 } = {}) {
    let where = 'studentId = ?';
    const params = [studentId];
    if (term) { where += ' AND term = ?'; params.push(term); }
    if (academicYear) { where += ' AND academicYear = ?'; params.push(academicYear); }
    if (subject) { where += ' AND subject = ?'; params.push(subject); }

    const rows = db.prepare(`SELECT * FROM grades WHERE ${where} ORDER BY COALESCE(dueDate, createdAt) DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM grades WHERE ${where}`).get(...params).c;
    return { grades: rows.map(r => this._withComputed(r)), total };
  },

  listByStudents(studentIds, { term, academicYear } = {}) {
    if (!studentIds.length) return [];
    const placeholders = studentIds.map(() => '?').join(',');
    let where = `studentId IN (${placeholders})`;
    const params = [...studentIds];
    if (term) { where += ' AND term = ?'; params.push(term); }
    if (academicYear) { where += ' AND academicYear = ?'; params.push(academicYear); }
    return db.prepare(`SELECT * FROM grades WHERE ${where} ORDER BY COALESCE(dueDate, createdAt) DESC`).all(...params)
      .map(r => this._withComputed(r));
  },

  _withComputed(g) {
    const percentage = Math.round((g.score / g.maxScore) * 100);
    return { ...g, percentage, letterGrade: letterGrade(percentage) };
  },

  // GPA on 4.0 scale
  gpa(studentId, { term, academicYear } = {}) {
    let where = 'studentId = ?';
    const params = [studentId];
    if (term) { where += ' AND term = ?'; params.push(term); }
    if (academicYear) { where += ' AND academicYear = ?'; params.push(academicYear); }
    const rows = db.prepare(`SELECT * FROM grades WHERE ${where}`).all(...params);
    if (!rows.length) return 0;
    const totalPoints = rows.reduce((sum, g) => sum + (g.score / g.maxScore) * g.weight, 0);
    const totalWeights = rows.reduce((sum, g) => sum + g.weight, 0);
    return totalWeights > 0 ? Math.round((totalPoints / totalWeights) * 4 * 100) / 100 : 0;
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare(`
      UPDATE grades SET assignmentName = ?, subject = ?, score = ?, maxScore = ?, weight = ?, type = ?,
      term = ?, academicYear = ?, dueDate = ?, feedback = ?, isLate = ?
      WHERE id = ?
    `).run(
      data.assignmentName || current.assignmentName, data.subject || current.subject, data.score || current.score,
      data.maxScore || current.maxScore, data.weight || current.weight, data.type || current.type,
      data.term || current.term, data.academicYear || current.academicYear, data.dueDate !== undefined ? data.dueDate : current.dueDate,
      data.feedback !== undefined ? data.feedback : current.feedback, data.isLate !== undefined ? (data.isLate ? 1 : 0) : current.isLate, id
    );
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM grades WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = gradeRepo;
