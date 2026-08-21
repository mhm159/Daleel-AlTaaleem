const { db, newId } = require('./index');

class QiyasRepo {
  static create(data) {
    const id = newId();
    // Generate a random 4-digit code and prepend QYS-
    const code = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `QYS-${code}`;
    
    const stmt = db.prepare(`
      INSERT INTO qiyas_requests (id, name, phone, grade, courseId, courseName, trackingCode)
      VALUES (@id, @name, @phone, @grade, @courseId, @courseName, @trackingCode)
    `);
    
    stmt.run({
      id,
      name: data.name,
      phone: data.phone,
      grade: data.grade,
      courseId: data.courseId,
      courseName: data.courseName,
      trackingCode
    });
    
    return this.getByTrackingCode(trackingCode);
  }

  static getByTrackingCode(code) {
    return db.prepare('SELECT * FROM qiyas_requests WHERE trackingCode = ?').get(code);
  }

  static getAll(limit = 50) {
    return db.prepare('SELECT * FROM qiyas_requests ORDER BY createdAt DESC LIMIT ?').all(limit);
  }

  static updateStatus(id, status) {
    db.prepare('UPDATE qiyas_requests SET status = ? WHERE id = ?').run(status, id);
    return db.prepare('SELECT * FROM qiyas_requests WHERE id = ?').get(id);
  }
}

module.exports = QiyasRepo;
