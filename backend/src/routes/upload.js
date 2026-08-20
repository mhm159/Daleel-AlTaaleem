const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { auth, admin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

router.post('/single', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, file: { filename: req.file.filename, url: `/uploads/${req.file.filename}`, size: req.file.size } });
});

router.post('/multiple', auth, upload.array('files', 10), (req, res) => {
  if (!req.files || !req.files.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
  res.json({ success: true, files: req.files.map(f => ({ filename: f.filename, url: `/uploads/${f.filename}`, size: f.size })) });
});

router.delete('/:filename', auth, admin, (req, res) => {
  const fp = path.join(__dirname, `../../uploads/${req.params.filename}`);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  res.json({ success: true, message: 'File deleted' });
});

module.exports = router;
