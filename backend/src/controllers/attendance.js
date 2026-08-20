const attendanceRepo = require('../db/attendanceRepo');

exports.byStudent = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 30 } = req.query;
    if (req.user.role === 'parent' && !req.user.children.some(c => c.studentId === req.params.studentId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { attendance, total } = attendanceRepo.listByStudent(req.params.studentId, { startDate, endDate, limit: parseInt(limit), offset: (page - 1) * limit });
    const summary = attendanceRepo.summary(req.params.studentId);
    res.json({ success: true, attendance, summary, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
};

exports.parentChildren = async (req, res) => {
  try {
    const studentIds = req.user.children.map(c => c.studentId);
    const attendance = attendanceRepo.listByStudents(studentIds, {});
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
};

exports.list = async (req, res) => {
  try {
    const { studentId, date, month, year, page = 1, limit = 50 } = req.query;
    if (studentId) {
      const { attendance, total } = attendanceRepo.listByStudent(studentId, { limit: parseInt(limit), offset: (page - 1) * limit });
      return res.json({ success: true, attendance, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    }
    // For simplicity, list all (admin)
    const { attendance, total } = attendanceRepo.listByStudent('%', { limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ success: true, attendance, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
};

exports.create = async (req, res) => {
  try {
    const { studentId, date, status, reason, notes, checkInTime, checkOutTime } = req.body;
    const attendance = attendanceRepo.create({ studentId, date, status, reason, notes, recordedBy: req.user.id, checkInTime, checkOutTime });
    res.status(201).json({ success: true, attendance });
  } catch (err) {
    console.error('Attendance create error:', err);
    res.status(500).json({ success: false, message: 'Error recording attendance' });
  }
};

exports.bulk = async (req, res) => {
  try {
    const { records, date } = req.body;
    const results = [];
    for (const record of records) {
      const attendance = attendanceRepo.create({ ...record, date, recordedBy: req.user.id });
      results.push(attendance);
    }
    res.status(201).json({ success: true, count: results.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error recording bulk attendance' });
  }
};

exports.update = async (req, res) => {
  try {
    const attendance = attendanceRepo.update(req.params.id, req.body);
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating attendance' });
  }
};

exports.delete = async (req, res) => {
  try {
    attendanceRepo.delete(req.params.id);
    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting attendance' });
  }
};
