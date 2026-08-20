'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../../lib/api';
import { Card, Loader, Alert, Badge } from '../ui/Button';

function AttendanceCard({ studentId, studentName }) {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, excused: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/attendance/student/${studentId}?limit=30`)
      .then(data => {
        setAttendance(data.attendance || []);
        setSummary(data.summary || { present: 0, absent: 0, late: 0, excused: 0, total: 0 });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-growth-100 text-growth-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-gold-100 text-gold-700',
      excused: 'bg-sky-100 text-sky-700',
    };
    return colors[status] || 'bg-house-100 text-house-700';
  };

  return (
    <div>
      <h4 className="mb-3 font-bold text-house-800">{studentName}</h4>
      {loading && <Loader />}
      {error && <Alert type="error" message={error} />}
      {!loading && !error && (
        <>
          <div className="mb-4 grid grid-cols-4 gap-2 text-center">
            <div className="rounded-lg bg-growth-50 p-2">
              <div className="text-lg font-bold text-growth-600">{summary.present}</div>
              <div className="text-xs text-house-500">حاضر</div>
            </div>
            <div className="rounded-lg bg-red-50 p-2">
              <div className="text-lg font-bold text-red-600">{summary.absent}</div>
              <div className="text-xs text-house-500">غائب</div>
            </div>
            <div className="rounded-lg bg-gold-50 p-2">
              <div className="text-lg font-bold text-gold-600">{summary.late}</div>
              <div className="text-xs text-house-500">متأخر</div>
            </div>
            <div className="rounded-lg bg-sky-50 p-2">
              <div className="text-lg font-bold text-sky-600">{summary.total}</div>
              <div className="text-xs text-house-500">أيام</div>
            </div>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {attendance.slice(0, 15).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-house-100 p-2">
                <span className="text-sm text-house-600">{new Date(a.date).toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className={`badge ${getStatusColor(a.status)}`}>{a.status === 'present' ? 'حاضر' : a.status === 'absent' ? 'غائب' : a.status === 'late' ? 'متأخر' : a.status}</span>
              </div>
            ))}
            {attendance.length === 0 && <p className="text-center text-sm text-house-400">لا توجد سجلات حضور</p>}
          </div>
        </>
      )}
    </div>
  );
}

function GradesCard({ studentId, studentName }) {
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/grades/student/${studentId}?limit=50`)
      .then(data => {
        setGrades(data.grades || []);
        setGpa(data.gpa || 0);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-bold text-house-800">{studentName}</h4>
        <Badge variant="sky">المعدل: {gpa.toFixed(2)}</Badge>
      </div>
      {loading && <Loader />}
      {error && <Alert type="error" message={error} />}
      {!loading && !error && (
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {grades.slice(0, 15).map((g) => (
            <div key={g.id} className="rounded-lg border border-house-100 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-house-800">{g.assignmentName}</span>
                <span className={`text-sm font-bold ${g.letterGrade === 'A' ? 'text-growth-600' : g.letterGrade === 'F' ? 'text-red-600' : 'text-sky-600'}`}>
                  {g.percentage}%
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-house-400">
                <span>{g.subject} • {g.type}</span>
                <span>{g.score}/{g.maxScore}</span>
              </div>
            </div>
          ))}
          {grades.length === 0 && <p className="text-center text-sm text-house-400">لا توجد درجات مسجلة بعد</p>}
        </div>
      )}
    </div>
  );
}

function MessagesCard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/conversations')
      .then(data => setMessages(data.conversations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h4 className="mb-3 font-bold text-house-800">أحدث الرسائل</h4>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border border-house-100 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-house-800">{m.withUser?.name || m.studentName || 'معلم'}</span>
              {m.unreadCount > 0 && <Badge variant="gold">{m.unreadCount} جديدة</Badge>}
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-house-500">{m.lastMessage.content}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-sm text-house-400">لا توجد رسائل حتى الآن</p>}
      </div>
    </div>
  );
}

function PaymentsCard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my-payments?limit=10')
      .then(data => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pending = payments.filter(p => p.status === 'pending').length;

  return (
    <div>
      <h4 className="mb-3 font-bold text-house-800">ملخص الرسوم</h4>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-growth-50 p-3 text-center">
          <div className="text-xl font-bold text-growth-600">{totalPaid.toLocaleString()} ريال</div>
          <div className="text-xs text-house-500">إجمالي المدفوعات</div>
        </div>
        <div className="rounded-lg bg-gold-50 p-3 text-center">
          <div className="text-xl font-bold text-gold-600">{pending}</div>
          <div className="text-xs text-house-500">قيد الانتظار</div>
        </div>
      </div>
      <div className="max-h-40 space-y-2 overflow-y-auto">
        {payments.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-house-100 p-2 text-sm">
            <span className="text-house-700">{p.description || p.type}</span>
            <span className={`badge ${p.status === 'completed' ? 'badge-growth' : 'badge-gold'}`}>{p.status === 'completed' ? 'مكتمل' : 'معلق'}</span>
          </div>
        ))}
        {payments.length === 0 && <p className="text-center text-sm text-house-400">لا توجد مدفوعات حتى الآن</p>}
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'parent') {
      api.get('/students/parent/me')
        .then(data => setChildren(data.students || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (user?.role === 'teacher' || user?.role === 'admin') {
      api.get('/students?limit=5')
        .then(data => setChildren(data.students || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-white">
        <h2 className="text-2xl font-bold">مرحباً بعودتك، {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="mt-1 text-sky-100">
          {user?.role === 'parent' && 'تابع تقدم أبنائك، وحضورهم، وابق على تواصل مع معلميهم.'}
          {user?.role === 'teacher' && 'أدر فصولك، وسجل الدرجات، وتواصل مع أولياء الأمور.'}
          {user?.role === 'admin' && 'صلاحيات إدارية كاملة لإدارة المدرسة.'}
        </p>
      </Card>>

      {/* Children overview */}
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Card key={child._id} className="flex items-center space-x-4 p-4">
              <img
                src={child.profilePhoto || 'https://images.unsplash.com/photo-1503454537194-598f118e6198?w=100'}
                alt={child.firstName}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-house-800">{child.firstName} {child.lastName}</div>
                <div className="text-sm text-house-500">{child.gradeLevel}</div>
                <Badge variant="growth">{child.status}</Badge>
              </div>
            </Card>
          ))}
          {children.length === 0 && (
            <Card className="p-4 text-center text-house-400">لا يوجد أبناء مرتبطين بالحساب</Card>
          )}
        </div>
      )}

      {/* Detailed cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <AttendanceCard
            studentId={children[0]?._id}
            studentName={children[0] ? `${children[0].firstName} ${children[0].lastName}` : 'طالب'}
          />
        </Card>
        <Card className="p-6">
          <GradesCard
            studentId={children[0]?._id}
            studentName={children[0] ? `${children[0].firstName} ${children[0].lastName}` : 'طالب'}
          />
        </Card>
        <Card className="p-6">
          <MessagesCard />
        </Card>
        <Card className="p-6">
          <PaymentsCard />
        </Card>
      </div>
    </div>
  );
}
