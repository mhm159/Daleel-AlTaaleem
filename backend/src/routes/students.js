const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, studentsController.list);
router.get('/parent/me', auth, studentsController.parentChildren);
router.get('/:id', auth, studentsController.getById);
router.post('/', auth, admin, studentsController.create);
router.put('/:id', auth, admin, studentsController.update);
router.delete('/:id', auth, admin, studentsController.delete);

module.exports = router;
