const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepo = require('../db/userRepo');
const { newId } = require('../db');

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  const refreshToken = jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, role, children } = req.body;
    if (userRepo.findByEmail(email)) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = userRepo.create({
      email, password: hashedPassword, name, phone, role: role || 'parent',
      children: children || [],
    });
    const { accessToken, refreshToken } = generateTokens(user.id);
    res.status(201).json({
      success: true, message: 'Registration successful',
      user: publicUser(user), accessToken, refreshToken,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = userRepo.findByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    userRepo.setLastLogin(user.id);
    const { accessToken, refreshToken } = generateTokens(user.id);
    res.json({ success: true, user: publicUser(user), accessToken, refreshToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Refresh
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = userRepo.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const { accessToken, refreshToken: newRefresh } = generateTokens(user.id);
    res.json({ success: true, accessToken, refreshToken: newRefresh });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profilePhoto } = req.body;
    const user = userRepo.update(req.user.id, { name, phone, address, profilePhoto });
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = userRepo.findById(req.user.id);
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    require('../db').db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.id);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const { users, total } = userRepo.list({ role, search, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({
      success: true,
      users: users.map(publicUser),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (userRepo.findByEmail(email)) return res.status(400).json({ success: false, message: 'Email already exists' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = userRepo.create({ email, password: hashedPassword, name, role: 'admin' });
    const { accessToken, refreshToken } = generateTokens(user.id);
    res.status(201).json({
      success: true, message: 'Admin created', user: publicUser(user), accessToken, refreshToken,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating admin' });
  }
};

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}
