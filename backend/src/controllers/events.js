const eventRepo = require('../db/eventRepo');

exports.list = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const { events, total } = eventRepo.list({ status: ['upcoming', 'ongoing'], category, limit: parseInt(limit), offset: (page - 1) * limit, upcomingOnly: true });
    res.json({
      success: true, events,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
};

exports.adminList = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { events, total } = eventRepo.list({ status, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ success: true, events, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
};

exports.getById = async (req, res) => {
  try {
    const event = eventRepo.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching event' });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const { id } = req.body;
    let event;
    if (id) event = eventRepo.update(id, req.body);
    else event = eventRepo.create(req.body);
    res.status(id ? 200 : 201).json({ success: true, event });
  } catch (err) {
    console.error('Event save error:', err);
    res.status(500).json({ success: false, message: 'Error saving event' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = eventRepo.updateStatus(req.params.id, status);
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

exports.delete = async (req, res) => {
  try {
    eventRepo.delete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting event' });
  }
};
