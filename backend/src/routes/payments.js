const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');
const { auth, admin } = require('../middleware/auth');

router.get('/my-payments', auth, paymentsController.myPayments);
router.get('/invoice/:invoiceNumber', auth, paymentsController.getByInvoice);
router.get('/', auth, admin, paymentsController.adminList);
router.post('/create-intent', auth, paymentsController.createIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.webhook);
router.put('/:id', auth, admin, paymentsController.update);
router.get('/stats', auth, admin, paymentsController.stats);

module.exports = router;
