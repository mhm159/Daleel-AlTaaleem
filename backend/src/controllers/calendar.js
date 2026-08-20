const calendarRepo = require('../db/calendarRepo');

exports.list = async (req, res) => {
  try {
    const { startDate, endDate, type, gradeLevel, page = 1, limit = 50 } = req.query;
    const { events, total } = calendarRepo.list({ startDate, endDate, type, gradeLevel, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ success: true, events, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching calendar' });
  }
};

exports.adminList = async (req, res) => {
  try {
    const { events } = calendarRepo.list({ limit: 500 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching calendar' });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const { id } = req.body;
    let event;
    if (id) event = calendarRepo.update(id, req.body);
    else event = calendarRepo.create(req.body);
    res.status(id ? 200 : 201).json({ success: true, event });
  } catch (err) {
    console.error('Calendar save error:', err);
    res.status(500).json({ success: false, message: 'Error saving calendar entry' });
  }
};

exports.delete = async (req, res) => {
  try {
    calendarRepo.delete(req.params.id);
    res.json({ success: true, message: 'Calendar entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting entry' });
  }
};
