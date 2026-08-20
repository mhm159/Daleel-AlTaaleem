const paymentRepo = require('../db/paymentRepo');
const admissionRepo = require('../db/admissionRepo');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

exports.myPayments = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const { payments, total } = paymentRepo.listByUser(req.user.id, { status, type, limit: parseInt(limit), offset: (page - 1) * limit });
    const totalPaid = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    res.json({
      success: true,
      payments: payments.map(p => ({ ...p, stripePaymentIntentId: undefined })),
      summary: { totalPaid, pending: payments.filter(p => p.status === 'pending').length, total: payments.length },
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching payments' });
  }
};

exports.getByInvoice = async (req, res) => {
  try {
    const payment = paymentRepo.findByInvoice(req.params.invoiceNumber, req.user.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, payment: { ...payment, stripePaymentIntentId: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching invoice' });
  }
};

exports.adminList = async (req, res) => {
  try {
    const { userId, status, type, page = 1, limit = 50 } = req.query;
    const { payments, total } = paymentRepo.list({ userId, status, type, limit: parseInt(limit), offset: (page - 1) * limit });
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    res.json({
      success: true, payments,
      summary: { totalRevenue, total },
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching payments' });
  }
};

exports.createIntent = async (req, res) => {
  try {
    const { amount, currency = 'sar', type, description, studentId, admissionId } = req.body;
    let payment = paymentRepo.create({
      userId: req.user.id, studentId, admissionId, amount, currency, type: type || 'tuition',
      description, status: 'pending',
    });

    let clientSecret = null;
    if (stripe) {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: { paymentId: payment.id, userId: req.user.id, type },
      });
      payment = paymentRepo.update(payment.id, { status: 'pending' });
      // store intent id
      require('../db').db.prepare('UPDATE payments SET stripePaymentIntentId = ? WHERE id = ?').run(intent.id, payment.id);
      clientSecret = intent.client_secret;
    } else {
      // Demo mode: simulate immediate success
      payment = paymentRepo.update(payment.id, { status: 'completed', paidAt: new Date().toISOString() });
      if (admissionId) admissionRepo.markRegistrationPaid(admissionId, payment.id);
    }

    res.json({
      success: true, clientSecret,
      payment: { id: payment.id, invoiceNumber: payment.invoiceNumber, amount: payment.amount, currency: payment.currency, type: payment.type, status: payment.status },
      demo: !stripe,
    });
  } catch (err) {
    console.error('Create intent error:', err);
    res.status(500).json({ success: false, message: 'Error creating payment' });
  }
};

exports.webhook = async (req, res) => {
  if (!stripe) return res.json({ received: true });
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const paymentId = intent.metadata.paymentId;
      if (paymentId) paymentRepo.update(paymentId, { status: 'completed', paidAt: new Date().toISOString() });
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: 'Webhook error' });
  }
};

exports.update = async (req, res) => {
  try {
    const payment = paymentRepo.update(req.params.id, req.body);
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating payment' });
  }
};

exports.stats = async (req, res) => {
  try {
    res.json({ success: true, stats: paymentRepo.stats() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};
