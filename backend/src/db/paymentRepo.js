/**
 * Payments repository
 */
const { db, newId } = require('./index');

function genInvoiceNumber(type) {
  const year = new Date().getFullYear();
  const prefix = { registration_fee: 'RG', tuition: 'TU', exam_fee: 'EX', activity_fee: 'AC', uniform: 'UN', other: 'OT' }[type] || 'OT';
  const count = db.prepare("SELECT COUNT(*) as c FROM payments WHERE type = ? AND createdAt >= ?")
    .get(type, `${year}-01-01`).c;
  return `LG-${year}-${prefix}-${String(count + 1).padStart(4, '0')}`;
}

const paymentRepo = {
  create({ userId, studentId, admissionId, amount, currency = 'SAR', type, description, stripePaymentIntentId, status = 'pending' }) {
    const id = newId();
    const invoiceNumber = genInvoiceNumber(type);
    db.prepare(`
      INSERT INTO payments (id, userId, studentId, admissionId, amount, currency, type, description, invoiceNumber, stripePaymentIntentId, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId || null, studentId || null, admissionId || null, amount, currency, type,
      description || null, invoiceNumber, stripePaymentIntentId || null, status);
    return this.findById(id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
  },

  findByInvoice(invoiceNumber, userId) {
    let sql = 'SELECT * FROM payments WHERE invoiceNumber = ?';
    const params = [invoiceNumber];
    if (userId) { sql += ' AND userId = ?'; params.push(userId); }
    return db.prepare(sql).get(...params);
  },

  listByUser(userId, { status, type, limit = 20, offset = 0 } = {}) {
    let where = 'userId = ?';
    const params = [userId];
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (type) { where += ' AND type = ?'; params.push(type); }
    const rows = db.prepare(`SELECT * FROM payments WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM payments WHERE ${where}`).get(...params).c;
    return { payments: rows, total };
  },

  list({ userId, status, type, limit = 50, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (userId) { where += ' AND userId = ?'; params.push(userId); }
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (type) { where += ' AND type = ?'; params.push(type); }
    const rows = db.prepare(`SELECT * FROM payments WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM payments WHERE ${where}`).get(...params).c;
    return { payments: rows, total };
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare('UPDATE payments SET status = ?, paidAt = ?, dueDate = ?, notes = ? WHERE id = ?')
      .run(data.status || current.status,
        data.status === 'completed' ? (data.paidAt || new Date().toISOString()) : current.paidAt,
        data.dueDate !== undefined ? data.dueDate : current.dueDate,
        data.notes !== undefined ? data.notes : current.notes, id);
    return this.findById(id);
  },

  stats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    const total = db.prepare('SELECT COUNT(*) as c FROM payments').get().c;
    const completed = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'completed'").get().c;
    const pending = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'pending'").get().c;
    const revenueRow = db.prepare("SELECT SUM(amount) as s FROM payments WHERE status = 'completed' AND createdAt BETWEEN ? AND ?")
      .get(startOfMonth, endOfMonth);
    const completedThisMonth = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'completed' AND createdAt BETWEEN ? AND ?")
      .get(startOfMonth, endOfMonth).c;

    return {
      totalPayments: total,
      completedPayments: completed,
      pendingPayments: pending,
      thisMonthRevenue: revenueRow.s || 0,
      thisMonthCompleted: completedThisMonth,
    };
  },

  delete(id) {
    return db.prepare('DELETE FROM payments WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = paymentRepo;
