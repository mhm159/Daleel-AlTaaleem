const express = require('express');
const router = express.Router();
const admissionsController = require('../controllers/admissions');
const { auth, admin } = require('../middleware/auth');

router.get('/', admissionsController.list);
router.post('/', admissionsController.submit);
router.get('/:id', auth, admissionsController.getById);
router.get('/admin/all', auth, admin, admissionsController.adminList);
router.put('/:id/status', auth, admin, admissionsController.updateStatus);
router.post('/:id/notes', auth, admin, admissionsController.addNote);
router.post('/:id/enroll', auth, admin, admissionsController.enroll);

module.exports = router;
