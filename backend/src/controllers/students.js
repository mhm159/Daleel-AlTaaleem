const studentRepo = require('../db/studentRepo');
const userRepo = require('../db/userRepo');

exports.list = async (req, res) => {
  try {
    const { grade, status, search, page = 1, limit = 20 } = req.query;
    const { students, total } = studentRepo.list({ grade, status, search, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ success: true, students, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

exports.getById = async (req, res) => {
  try {
    const student = studentRepo.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (req.user.role === 'parent' && !req.user.children.some(c => c.studentId === req.params.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching student' });
  }
};

exports.parentChildren = async (req, res) => {
  try {
    const students = studentRepo.findByParent(req.user.id);
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching your children' });
  }
};

exports.create = async (req, res) => {
  try {
    const student = studentRepo.create(req.body);
    res.status(201).json({ success: true, student });
  } catch (err) {
    console.error('Student create error:', err);
    res.status(500).json({ success: false, message: 'Error creating student' });
  }
};

exports.update = async (req, res) => {
  try {
    const student = studentRepo.update(req.params.id, req.body);
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating student' });
  }
};

exports.delete = async (req, res) => {
  try {
    studentRepo.delete(req.params.id);
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting student' });
  }
};
