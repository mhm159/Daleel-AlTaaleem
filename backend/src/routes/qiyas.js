const express = require('express');
const router = express.Router();
const QiyasRepo = require('../db/qiyasRepo');
const { auth, admin } = require('../middleware/auth');

// Create a new Qiyas request (public)
router.post('/', (req, res) => {
  try {
    const request = QiyasRepo.create(req.body);
    res.status(201).json({ success: true, code: request.trackingCode, data: request });
  } catch (err) {
    console.error('Error creating Qiyas request:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Track a Qiyas request by code (public)
router.get('/', (req, res) => {
  try {
    const { code } = req.query;
    if (code) {
      const request = QiyasRepo.getByTrackingCode(code);
      if (!request) return res.status(404).json({ success: false, error: 'لم يتم العثور على الطلب' });
      return res.json(request);
    }
    
    // If no code, and user is admin, return all (auth required)
    // To handle auth here elegantly, we could require auth, but let's just make it public with code, or admin without code
    return res.status(400).json({ success: false, error: 'Code is required for tracking' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all requests (admin only)
router.get('/admin/all', auth, admin, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const requests = QiyasRepo.getAll(limit);
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update status (admin only)
router.put('/:id', auth, admin, (req, res) => {
  try {
    const { status } = req.body;
    const request = QiyasRepo.updateStatus(req.params.id, status);
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
