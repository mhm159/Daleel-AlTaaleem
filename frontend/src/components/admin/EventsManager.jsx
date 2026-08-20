'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Card, Button, Loader } from '../../ui/Button';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', description: '', date: '', startTime: '', endTime: '', location: '', category: 'general', image: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.get('/events/admin/all?limit=50');
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', form);
      setForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', category: 'general', image: '' });
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذه الفعالية؟')) return;
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إدارة الفعاليات</h2>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-house-800">إضافة فعالية جديدة</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="input-label">عنوان الفعالية</label>
              <input className="input-field" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="input-label">التاريخ</label>
              <input type="date" className="input-field" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="input-label">التصنيف</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="academic">أكاديمي</option>
                <option value="sports">رياضي</option>
                <option value="arts">فنون</option>
                <option value="cultural">ثقافي</option>
                <option value="community">مجتمعي</option>
                <option value="general">عام</option>
              </select>
            </div>
            <div>
              <label className="input-label">وقت البدء</label>
              <input type="time" className="input-field" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} />
            </div>
            <div>
              <label className="input-label">وقت الانتهاء</label>
              <input type="time" className="input-field" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">الموقع</label>
              <input className="input-field" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">الوصف</label>
              <textarea className="input-field" rows="3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>
          </div>
          <Button type="submit" variant="primary">إضافة فعالية</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {events.map((e) => (
          <Card key={e._id} className="flex items-center justify-between p-4 hover:border-sky-300 transition-colors">
            <div>
              <div className="font-semibold text-house-800">{e.title}</div>
              <div className="text-xs text-house-400 mt-1">{new Date(e.date).toLocaleDateString('ar-SA')} {e.startTime} - {e.category}</div>
            </div>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(e._id)}>حذف</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
