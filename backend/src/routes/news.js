const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const { auth, admin } = require('../middleware/auth');

router.get('/', newsController.list);
router.get('/:slug', newsController.getBySlug);
router.get('/admin/all', auth, admin, newsController.adminList);
router.post('/', auth, admin, newsController.createOrUpdate);
router.delete('/:id', auth, admin, newsController.delete);

module.exports = router;
