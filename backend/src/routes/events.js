const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const { auth, admin } = require('../middleware/auth');

router.get('/', eventsController.list);
router.get('/admin/all', auth, admin, eventsController.adminList);
router.get('/:id', eventsController.getById);
router.post('/', auth, admin, eventsController.createOrUpdate);
router.put('/:id/status', auth, admin, eventsController.updateStatus);
router.delete('/:id', auth, admin, eventsController.delete);

module.exports = router;
