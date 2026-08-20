/**
 * Student repository
 */
const { db, newId } = require('./index');

const studentRepo = {
  create(data) {
    const id = newId();
    db.prepare(`
      INSERT INTO students (
        id, firstName, lastName, dateOfBirth, gender, gradeLevel, classId, parentId, enrollmentDate,
        status, profilePhoto, address, emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
        medicalInfo, previousSchool, admissionNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.firstName, data.lastName, data.dateOfBirth, data.gender, data.gradeLevel,
      data.classId || null, data.parentId || null, data.enrollmentDate || new Date().toISOString(),
      data.status || 'active', data.profilePhoto || null, data.address || null,
      data.emergencyContact?.name || null, data.emergencyContact?.phone || null, data.emergencyContact?.relationship || null,
      data.medicalInfo || null, data.previousSchool || null, data.admissionNumber || null
    );
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  },

  list({ grade, status, search, limit = 20, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (grade) { where += ' AND gradeLevel = ?'; params.push(grade); }
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (search) { where += ' AND (firstName LIKE ? OR lastName LIKE ? OR admissionNumber LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    const rows = db.prepare(`SELECT * FROM students WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM students WHERE ${where}`).get(...params).c;
    return { students: rows, total };
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare(`
      UPDATE students SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, gradeLevel = ?,
      classId = ?, parentId = ?, status = ?, profilePhoto = ?, address = ?, medicalInfo = ?, previousSchool = ?
      WHERE id = ?
    `).run(
      data.firstName || current.firstName, data.lastName || current.lastName, data.dateOfBirth || current.dateOfBirth,
      data.gender || current.gender, data.gradeLevel || current.gradeLevel, data.classId !== undefined ? data.classId : current.classId,
      data.parentId !== undefined ? data.parentId : current.parentId, data.status || current.status,
      data.profilePhoto !== undefined ? data.profilePhoto : current.profilePhoto, data.address !== undefined ? data.address : current.address,
      data.medicalInfo !== undefined ? data.medicalInfo : current.medicalInfo, data.previousSchool !== undefined ? data.previousSchool : current.previousSchool, id
    );
    return this.findById(id);
  },

  // Children of a parent
  findByParent(parentId) {
    return db.prepare(`
      SELECT s.* FROM students s
      JOIN user_children uc ON s.id = uc.studentId
      WHERE uc.userId = ?
    `).all(parentId);
  },

  delete(id) {
    return db.prepare('DELETE FROM students WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = studentRepo;
