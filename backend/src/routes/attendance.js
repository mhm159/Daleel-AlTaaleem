const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');
const { auth, admin } = require('../middleware/auth');

router.get('/student/:studentId', auth, attendanceController.byStudent);
router.get('/parent/my-children', auth, attendanceController.parentChildren);
router.get('/', auth, admin, attendanceController.list);
router.post('/', auth, attendanceController.create);
router.post('/bulk', auth, attendanceController.bulk);
router.put('/:id', auth, admin, attendanceController.update);
router.delete('/:id', auth, admin, attendanceController.delete);

module.exports = router;
