/**
 * Admissions repository
 */
const { db, newId } = require('./index');

function genAdmissionNumber() {
  const year = new Date().getFullYear();
  const count = db.prepare("SELECT COUNT(*) as c FROM admissions WHERE createdAt >= ?")
    .get(`${year}-01-01`).c;
  return `AD${year}-${String(count + 1).padStart(4, '0')}`;
}

const admissionRepo = {
  create(data) {
    const id = newId();
    const admissionNumber = genAdmissionNumber();
    db.prepare(`
      INSERT INTO admissions (
        id, firstName, lastName, dateOfBirth, gender, gradeApplyingFor, parentName, parentEmail,
        parentPhone, relationship, address, city, zipCode, country, previousSchool, previousGrade,
        documents, source, referralName, additionalInfo, admissionNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.firstName, data.lastName, data.dateOfBirth, data.gender, data.gradeApplyingFor,
      data.parentName, data.parentEmail, data.parentPhone, data.relationship || 'parent',
      data.address, data.city, data.zipCode || null, data.country || 'Saudi Arabia',
      data.previousSchool || null, data.previousGrade || null,
      JSON.stringify(data.documents || {}), data.source || 'website', data.referralName || null,
      data.additionalInfo || null, admissionNumber
    );
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM admissions WHERE id = ?').get(id);
  },

  list({ status, grade, limit = 20, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (grade) { where += ' AND gradeApplyingFor = ?'; params.push(grade); }

    const rows = db.prepare(`SELECT * FROM admissions WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM admissions WHERE ${where}`).get(...params).c;
    return { admissions: rows, total };
  },

  updateStatus(id, { status, rejectionReason, interviewDate, interviewNotes }) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare(`
      UPDATE admissions SET status = ?, rejectionReason = ?, interviewDate = ?, interviewNotes = ?
      WHERE id = ?
    `).run(status || current.status, rejectionReason !== undefined ? rejectionReason : current.rejectionReason,
      interviewDate !== undefined ? interviewDate : current.interviewDate,
      interviewNotes !== undefined ? interviewNotes : current.interviewNotes, id);
    return this.findById(id);
  },

  addNote(id, note, by) {
    const nid = newId();
    db.prepare('INSERT INTO admission_notes (id, admissionId, note, by) VALUES (?, ?, ?, ?)')
      .run(nid, id, note, by || null);
    return db.prepare('SELECT * FROM admission_notes WHERE id = ?').get(nid);
  },

  getNotes(id) {
    return db.prepare('SELECT * FROM admission_notes WHERE admissionId = ? ORDER BY createdAt ASC').all(id);
  },

  markRegistrationPaid(id, transactionId) {
    db.prepare('UPDATE admissions SET registrationFeePaid = 1, registrationFeeTransactionId = ?, registrationFeePaidAt = CURRENT_TIMESTAMP WHERE id = ?')
      .run(transactionId, id);
    return this.findById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM admissions WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = admissionRepo;
