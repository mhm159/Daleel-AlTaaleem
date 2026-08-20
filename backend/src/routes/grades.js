const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades');
const { auth, admin } = require('../middleware/auth');

router.get('/student/:studentId', auth, gradesController.byStudent);
router.get('/parent/my-children', auth, gradesController.parentChildren);
router.get('/', auth, admin, gradesController.list);
router.post('/', auth, gradesController.create);
router.post('/bulk', auth, gradesController.bulk);
router.put('/:id', auth, gradesController.update);
router.delete('/:id', auth, admin, gradesController.delete);

module.exports = router;
