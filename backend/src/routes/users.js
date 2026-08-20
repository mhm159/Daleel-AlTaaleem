const express = require('express');
const router = express.Router();
const userRepo = require('../db/userRepo');
const { auth, admin } = require('../middleware/auth');

const publicUser = (u) => { if (!u) return null; const { password, ...rest } = u; return rest; };

router.get('/me', auth, (req, res) => res.json({ success: true, user: publicUser(req.user) }));

router.put('/profile', auth, (req, res) => {
  const user = userRepo.update(req.user.id, req.body);
  res.json({ success: true, user: publicUser(user) });
});

router.get('/', auth, admin, (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const { users, total } = userRepo.list({ role, search, limit: parseInt(limit), offset: (page - 1) * limit });
  res.json({ success: true, users: users.map(publicUser), pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
});

router.get('/:id', auth, (req, res) => {
  const user = userRepo.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: publicUser(user) });
});

router.put('/:id', auth, admin, (req, res) => {
  const user = userRepo.update(req.params.id, req.body);
  res.json({ success: true, user: publicUser(user) });
});

router.delete('/:id', auth, admin, (req, res) => {
  userRepo.hardDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

module.exports = router;
