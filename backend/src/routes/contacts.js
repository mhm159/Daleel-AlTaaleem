const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const { auth, admin } = require('../middleware/auth');

router.post('/', contactsController.submit);
router.get('/', auth, admin, contactsController.list);
router.get('/:id', auth, admin, contactsController.getById);
router.put('/:id', auth, admin, contactsController.update);
router.delete('/:id', auth, admin, contactsController.delete);

module.exports = router;
