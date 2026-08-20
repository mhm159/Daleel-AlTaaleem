const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar');
const { auth, admin } = require('../middleware/auth');

router.get('/', calendarController.list);
router.get('/admin/all', auth, admin, calendarController.adminList);
router.post('/', auth, admin, calendarController.createOrUpdate);
router.delete('/:id', auth, admin, calendarController.delete);

module.exports = router;
