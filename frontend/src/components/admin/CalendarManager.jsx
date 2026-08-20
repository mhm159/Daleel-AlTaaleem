'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, Button, Loader } from '../ui/Button';

export default function CalendarManager() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', startDate: '', endDate: '', description: '', type: 'event', color: '#0ea5e9', isAllDay: true, gradeLevel: 'all',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await api.get('/calendar/admin/all');
      setEntries(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/calendar', form);
      setForm({ title: '', startDate: '', endDate: '', description: '', type: 'event', color: '#0ea5e9', isAllDay: true, gradeLevel: 'all' });
      loadEntries();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا الإدخال؟')) return;
    try {
      await api.delete(`/calendar/${id}`);
      loadEntries();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">التقويم الدراسي</h2>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-house-800">إضافة للتقويم</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="input-label">العنوان</label>
              <input className="input-field" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="input-label">تاريخ البدء</label>
              <input type="date" className="input-field" required value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
            </div>
            <div>
              <label className="input-label">تاريخ الانتهاء</label>
              <input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
            </div>
            <div>
              <label className="input-label">النوع</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                <option value="term">فصل دراسي</option>
                <option value="exam">اختبار</option>
                <option value="holiday">عطلة</option>
                <option value="break">إجازة</option>
                <option value="event">فعالية</option>
                <option value="deadline">موعد نهائي</option>
                <option value="parent_meeting">اجتماع أولياء الأمور</option>
              </select>
            </div>
            <div>
              <label className="input-label">اللون</label>
              <input type="color" className="input-field h-12" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">الوصف</label>
              <textarea className="input-field" rows="2" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>
          </div>
          <Button type="submit" variant="primary">إضافة إدخال</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {entries.map((e) => (
          <Card key={e._id} className="flex items-center justify-between p-4 hover:border-sky-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: e.color }}></div>
              <div>
                <div className="font-semibold text-house-800">{e.title}</div>
                <div className="text-xs text-house-400 mt-1">{new Date(e.startDate).toLocaleDateString('ar-SA')} - {e.type}</div>
              </div>
            </div>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(e._id)}>حذف</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
