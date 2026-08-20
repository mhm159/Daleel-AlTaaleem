const gradeRepo = require('../db/gradeRepo');

exports.byStudent = async (req, res) => {
  try {
    const { term, academicYear, subject, page = 1, limit = 50 } = req.query;
    if (req.user.role === 'parent' && !req.user.children.some(c => c.studentId === req.params.studentId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { grades, total } = gradeRepo.listByStudent(req.params.studentId, { term, academicYear, subject, limit: parseInt(limit), offset: (page - 1) * limit });
    const gpa = gradeRepo.gpa(req.params.studentId, { term, academicYear });
    res.json({
      success: true, grades, gpa,
      summary: { total, averagePercentage: grades.length ? Math.round(grades.reduce((s, g) => s + g.percentage, 0) / grades.length) : 0 },
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching grades' });
  }
};

exports.parentChildren = async (req, res) => {
  try {
    const studentIds = req.user.children.map(c => c.studentId);
    const { term, academicYear } = req.query;
    const grades = gradeRepo.listByStudents(studentIds, { term, academicYear });
    res.json({ success: true, grades });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching grades' });
  }
};

exports.list = async (req, res) => {
  try {
    const { studentId, subject, term, academicYear, page = 1, limit = 50 } = req.query;
    if (studentId) {
      const { grades, total } = gradeRepo.listByStudent(studentId, { term, academicYear, subject, limit: parseInt(limit), offset: (page - 1) * limit });
      return res.json({ success: true, grades, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    }
    const { grades, total } = gradeRepo.listByStudent('%', { term, academicYear, subject, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ success: true, grades, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching grades' });
  }
};

exports.create = async (req, res) => {
  try {
    const { studentId, assignmentName, subject, score, maxScore, weight, type, term, academicYear, dueDate, feedback } = req.body;
    const grade = gradeRepo.create({
      studentId, assignmentName, subject, score, maxScore, weight: weight || 1, type: type || 'homework',
      term: term || 'fall', academicYear: academicYear || String(new Date().getFullYear()),
      dueDate, feedback, recordedBy: req.user.id,
    });
    res.status(201).json({ success: true, grade });
  } catch (err) {
    console.error('Grade create error:', err);
    res.status(500).json({ success: false, message: 'Error recording grade' });
  }
};

exports.bulk = async (req, res) => {
  try {
    const grades = req.body.grades.map(g => gradeRepo.create({ ...g, recordedBy: req.user.id }));
    res.status(201).json({ success: true, count: grades.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error recording bulk grades' });
  }
};

exports.update = async (req, res) => {
  try {
    const grade = gradeRepo.update(req.params.id, req.body);
    res.json({ success: true, grade });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating grade' });
  }
};

exports.delete = async (req, res) => {
  try {
    gradeRepo.delete(req.params.id);
    res.json({ success: true, message: 'Grade deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting grade' });
  }
};
