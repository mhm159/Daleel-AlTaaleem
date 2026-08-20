const express = require('express');
const router = express.Router();
const { register, login, refreshToken, me, updateProfile, changePassword, getAllUsers, createAdmin } = require('../controllers/auth');
const { auth, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/create-admin', createAdmin);

router.get('/me', auth, me);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);
router.get('/users', auth, admin, getAllUsers);

module.exports = router;
