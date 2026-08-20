const admissionRepo = require('../db/admissionRepo');
const userRepo = require('../db/userRepo');
const studentRepo = require('../db/studentRepo');

exports.list = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { admissions, total } = admissionRepo.list({ status, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({
      success: true,
      admissions: admissions.map(a => ({
        id: a.id, firstName: a.firstName, lastName: a.lastName, gradeApplyingFor: a.gradeApplyingFor,
        parentEmail: a.parentEmail, status: a.status, createdAt: a.createdAt, admissionDate: a.admissionDate,
      })),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching admissions' });
  }
};

exports.submit = async (req, res) => {
  try {
    const admission = admissionRepo.create(req.body);
    res.status(201).json({
      success: true, message: 'Application submitted successfully',
      admissionNumber: admission.admissionNumber,
      admission: { id: admission.id, firstName: admission.firstName, lastName: admission.lastName, gradeApplyingFor: admission.gradeApplyingFor, status: admission.status },
    });
  } catch (err) {
    console.error('Admission submit error:', err);
    res.status(500).json({ success: false, message: 'Error submitting application' });
  }
};

exports.getById = async (req, res) => {
  try {
    const admission = admissionRepo.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
    if (req.user.role === 'parent' && admission.parentEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, admission });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching application' });
  }
};

exports.adminList = async (req, res) => {
  try {
    const { status, grade, page = 1, limit = 20 } = req.query;
    const { admissions, total } = admissionRepo.list({ status, grade, limit: parseInt(limit), offset: (page - 1) * limit });
    const withNotes = admissions.map(a => ({ ...a, notes: admissionRepo.getNotes(a.id) }));
    res.json({ success: true, admissions: withNotes, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching admissions' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, rejectionReason, interviewDate, interviewNotes } = req.body;
    const admission = admissionRepo.updateStatus(req.params.id, { status, rejectionReason, interviewDate, interviewNotes });
    res.json({ success: true, admission });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating admission' });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const result = admissionRepo.addNote(req.params.id, note, req.user.id);
    res.json({ success: true, note: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding note' });
  }
};

exports.enroll = async (req, res) => {
  try {
    const admission = admissionRepo.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
    if (admission.status !== 'accepted') return res.status(400).json({ success: false, message: 'Can only enroll accepted applications' });

    // Find or create parent
    let parent = userRepo.findByEmail(admission.parentEmail);
    if (!parent) {
      parent = userRepo.create({
        email: admission.parentEmail, password: require('bcryptjs').hashSync('changeme123', 12),
        name: admission.parentName, phone: admission.parentPhone, role: 'parent',
      });
    }

    const student = studentRepo.create({
      firstName: admission.firstName, lastName: admission.lastName, dateOfBirth: admission.dateOfBirth,
      gender: admission.gender, gradeLevel: admission.gradeApplyingFor, parentId: parent.id,
      enrollmentDate: new Date().toISOString(), admissionNumber: admission.admissionNumber,
    });

    // Link child to parent
    require('../db').db.prepare('INSERT OR IGNORE INTO user_children (userId, studentId, relationship) VALUES (?, ?, ?)')
      .run(parent.id, student.id, admission.relationship || 'parent');

    admissionRepo.updateStatus(req.params.id, { status: 'enrolled' });

    res.json({ success: true, message: 'Student enrolled successfully', student });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ success: false, message: 'Error enrolling student' });
  }
};
