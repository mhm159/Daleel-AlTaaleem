'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';
import LoginForm from '../../components/portal/LoginForm';
import PortalDashboard from '../../components/portal/PortalDashboard';
import MessagingPanel from '../../components/portal/MessagingPanel';
import { Card, Badge, Loader, Alert, Button } from '../../components/ui/Button';

const TABS = [
  { id: 'dashboard', label: 'نظرة عامة', icon: '🏠' },
  { id: 'attendance', label: 'الحضور والغياب', icon: '📅' },
  { id: 'grades', label: 'الدرجات', icon: '📊' },
  { id: 'messages', label: 'الرسائل', icon: '💬' },
  { id: 'payments', label: 'الرسوم', icon: '💳' },
];


function AttendanceTab() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user?.role === 'parent' ? '/students/parent/me' : '/students?limit=10';
    api.get(endpoint)
      .then(data => {
        const students = data.students || [];
        setChildren(students);
        if (students[0]) setSelected(students[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (selected) {
      api.get(`/attendance/student/${selected}?limit=50`)
        .then(data => {
          setAttendance(data.attendance || []);
          setSummary(data.summary || null);
        })
        .catch(() => {});
    }
  }, [selected]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {/* Child selector */}
      <div className="flex flex-wrap gap-2">
        {children.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelected(c._id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selected === c._id ? 'bg-sky-500 text-white' : 'bg-house-100 text-house-600 hover:bg-house-200'
            }`}
          >
            {c.firstName} {c.lastName}
          </button>
        ))}
      </div>

      {summary && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="p-4 text-center"><div className="text-2xl font-bold text-growth-600">{summary.present}</div><div className="text-xs text-house-500">حاضر</div></Card>
          <Card className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{summary.absent}</div><div className="text-xs text-house-500">غائب</div></Card>
          <Card className="p-4 text-center"><div className="text-2xl font-bold text-gold-600">{summary.late}</div><div className="text-xs text-house-500">متأخر</div></Card>
          <Card className="p-4 text-center"><div className="text-2xl font-bold text-sky-600">{summary.total}</div><div className="text-xs text-house-500">إجمالي الأيام</div></Card>
        </div>
      )}

      <Card className="overflow-hidden">
        <table className="table-modern">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.date).toLocaleDateString('ar-SA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td><span className={`badge ${a.status === 'present' ? 'badge-growth' : a.status === 'absent' ? 'bg-red-100 text-red-700' : a.status === 'late' ? 'badge-gold' : 'badge-sky'}`}>{a.status === 'present' ? 'حاضر' : a.status === 'absent' ? 'غائب' : a.status === 'late' ? 'متأخر' : a.status}</span></td>
                <td className="text-house-500">{a.reason || a.notes || '-'}</td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr><td colSpan="3" className="text-center text-house-400">لا توجد سجلات حضور</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function GradesTab() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user?.role === 'parent' ? '/students/parent/me' : '/students?limit=10';
    api.get(endpoint)
      .then(data => {
        const students = data.students || [];
        setChildren(students);
        if (students[0]) setSelected(students[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (selected) {
      api.get(`/grades/student/${selected}?limit=100`)
        .then(data => {
          setGrades(data.grades || []);
          setGpa(data.gpa || 0);
        })
        .catch(() => {});
    }
  }, [selected]);

  if (loading) return <Loader />;

  // Group by subject
  const bySubject = {};
  grades.forEach(g => {
    if (!bySubject[g.subject]) bySubject[g.subject] = [];
    bySubject[g.subject].push(g);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {children.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelected(c._id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selected === c._id ? 'bg-sky-500 text-white' : 'bg-house-100 text-house-600 hover:bg-house-200'
            }`}
          >
            {c.firstName} {c.lastName}
          </button>
        ))}
        <Badge variant="sky">المعدل: {gpa.toFixed(2)}</Badge>
      </div>

      {Object.entries(bySubject).map(([subject, subs]) => {
        const avg = Math.round(subs.reduce((sum, g) => sum + g.percentage, 0) / subs.length);
        return (
          <Card key={subject} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-house-800">{subject}</h3>
              <Badge variant={avg >= 80 ? 'growth' : avg >= 60 ? 'gold' : 'sky'}>{avg}% متوسط</Badge>
            </div>
            <div className="space-y-2">
              {subs.map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-lg border border-house-100 p-3">
                  <div>
                    <div className="text-sm font-medium text-house-800">{g.assignmentName}</div>
                    <div className="text-xs text-house-400">{g.type} • {new Date(g.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${g.letterGrade === 'A' ? 'text-growth-600' : g.letterGrade === 'F' ? 'text-red-600' : 'text-sky-600'}`}>
                      {g.percentage}% ({g.letterGrade})
                    </div>
                    <div className="text-xs text-house-400">{g.score}/{g.maxScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
      {grades.length === 0 && <Card className="p-6 text-center text-house-400">لا توجد درجات مسجلة بعد</Card>}
    </div>
  );
}

function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    api.get('/payments/my-payments?limit=50')
      .then(data => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const data = await api.post('/payments/create-intent', {
        amount,
        currency: 'sar',
        type: 'tuition',
        description: 'Tuition Fee Payment',
      });
      if (data.success) {
        setClientSecret(data.clientSecret);
        // In production: use Stripe.js to confirm payment with clientSecret
        alert('Demo mode: Payment intent created. In production, Stripe.js would handle the payment.');
        setShowPayment(false);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6 text-center"><div className="text-3xl font-bold text-growth-600">{totalPaid.toLocaleString()} ريال</div><div className="text-sm text-house-500">إجمالي المدفوعات</div></Card>
        <Card className="p-6 text-center"><div className="text-3xl font-bold text-gold-600">{payments.filter(p => p.status === 'pending').length}</div><div className="text-sm text-house-500">المدفوعات المعلقة</div></Card>
        <Card className="p-6 text-center"><div className="text-3xl font-bold text-sky-600">{payments.length}</div><div className="text-sm text-house-500">إجمالي الفواتير</div></Card>
      </div>

      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setShowPayment(!showPayment)}>
          {showPayment ? 'إلغاء' : 'دفع الرسوم إلكترونياً'}
        </Button>
      </div>

      {showPayment && (
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-house-800">إجراء عملية دفع</h3>
          <div className="space-y-4">
            <div>
              <label className="input-label">المبلغ (ريال سعودي)</label>
              <input
                type="number"
                className="input-field"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="100"
              />
            </div>
            <Button variant="gold" onClick={handlePayment} disabled={processing} className="w-full">
              {processing ? 'جارِ المعالجة...' : 'ادفع الآن (Stripe)'}
            </Button>
            <p className="text-xs text-house-400 text-center">
              🔒 دفع آمن مدعوم من Stripe. وضع تجريبي - لن يتم خصم أي مبلغ حقيقي.
            </p>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <table className="table-modern">
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>الوصف</th>
              <th>المبلغ</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-sm">{p.invoiceNumber}</td>
                <td>{p.description || p.type}</td>
                <td className="font-semibold">{p.amount.toLocaleString()} ريال</td>
                <td>{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                <td><span className={`badge ${p.status === 'completed' ? 'badge-growth' : 'badge-gold'}`}>{p.status === 'completed' ? 'مكتمل' : 'معلق'}</span></td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="5" className="text-center text-house-400">لا توجد سجلات مدفوعات</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function PortalPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-house-800">بوابة ولي الأمر</h1>
            <p className="text-house-500">أهلاً، {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout}>تسجيل الخروج</Button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 rounded-full px-5 py-2.5 font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white text-house-600 hover:bg-sky-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pb-12">
          {activeTab === 'dashboard' && <PortalDashboard />}
          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'grades' && <GradesTab />}
          {activeTab === 'messages' && <MessagingPanel />}
          {activeTab === 'payments' && <PaymentsTab />}
        </div>
      </div>
    </div>
  );
}
