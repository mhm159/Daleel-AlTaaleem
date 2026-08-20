const contactRepo = require('../db/contactRepo');

exports.submit = async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject and message are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email address' });
    const contact = contactRepo.create({ name, email, phone, subject, message, category });
    res.status(201).json({ success: true, message: 'Your message has been sent successfully', contact });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ success: false, message: 'Error submitting contact form' });
  }
};

exports.list = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const { contacts, summary, total } = contactRepo.list({ status, category, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ success: true, contacts, summary, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
};

exports.getById = async (req, res) => {
  try {
    const contact = contactRepo.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching contact' });
  }
};

exports.update = async (req, res) => {
  try {
    const { status, replyContent } = req.body;
    const contact = contactRepo.update(req.params.id, { status, replyContent });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating contact' });
  }
};

exports.delete = async (req, res) => {
  try {
    contactRepo.delete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting contact' });
  }
};
