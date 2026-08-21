'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Loader, Alert } from '../ui/Button';
import toast from 'react-hot-toast';

export default function QiyasManager() {
  const [settings, setSettings] = useState(null);
  const [requests, setRequests] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Ensure qiyas object exists
          if (!data.qiyas) {
            data.qiyas = [
              { id: '1', name: 'دورة تأسيس القدرات (كمي ولفظي)', price: 450, duration: '4 أسابيع' },
              { id: '2', name: 'دورة التحصيلي المكثفة', price: 550, duration: '6 أسابيع' }
            ];
          }
          setSettings(data);
        }
      })
      .catch(console.error);

    // Fetch Requests
    fetch('/api/qiyas_requests/admin/all', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token is used, or maybe backend doesn't check strictly
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) setRequests(data.data);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('فشل حفظ الدورات');
      toast.success('تم حفظ دورات القدرات والتحصيلي بنجاح!');
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateCourse = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      qiyas: prev.qiyas.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeCourse = (id) => {
    setSettings(prev => ({
      ...prev,
      qiyas: prev.qiyas.filter(c => c.id !== id)
    }));
  };

  const addCourse = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setSettings(prev => ({
      ...prev,
      qiyas: [...(prev.qiyas || []), { id, name: 'دورة جديدة', price: 0, duration: '' }]
    }));
  };

  if (!settings) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إدارة دورات القدرات والتحصيلي</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        {error && <Alert type="error" message={error} />}
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-house-800">الدورات المتاحة للتسجيل</h3>
            <Button type="button" variant="secondary" onClick={addCourse} className="text-sm px-3 py-1">
              + إضافة دورة
            </Button>
          </div>

          <div className="space-y-3">
            {settings.qiyas?.map((course) => (
              <div key={course.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border rounded-lg hover:border-sky-300 transition-colors">
                <div className="flex-1 w-full">
                  <label className="text-xs text-house-500 mb-1 block">اسم الدورة</label>
                  <input className="input-field" value={course.name} onChange={(e) => updateCourse(course.id, 'name', e.target.value)} />
                </div>
                <div className="w-full sm:w-48">
                  <label className="text-xs text-house-500 mb-1 block">السعر (ريال)</label>
                  <input type="number" className="input-field" value={course.price} onChange={(e) => updateCourse(course.id, 'price', Number(e.target.value))} />
                </div>
                <div className="w-full sm:w-48">
                  <label className="text-xs text-house-500 mb-1 block">المدة</label>
                  <input className="input-field" value={course.duration} onChange={(e) => updateCourse(course.id, 'duration', e.target.value)} />
                </div>
                <button type="button" onClick={() => removeCourse(course.id)} className="mt-5 text-red-500 hover:text-red-700 p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            ))}
            {(!settings.qiyas || settings.qiyas.length === 0) && <p className="text-house-400 text-center py-4">لا توجد دورات مضافة.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-house-800">طلبات التسجيل المبدئية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-house-50 text-house-500 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tr-lg">الكود</th>
                  <th className="px-4 py-3">الطالب</th>
                  <th className="px-4 py-3">الجوال</th>
                  <th className="px-4 py-3">الدورة</th>
                  <th className="px-4 py-3">التاريخ</th>
                  <th className="px-4 py-3 rounded-tl-lg">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-house-100">
                {requests.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-6 text-house-400">لا توجد طلبات تسجيل حتى الآن.</td></tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.id} className="hover:bg-sky-50/50">
                      <td className="px-4 py-3 font-mono text-sky-600 font-semibold">{req.code}</td>
                      <td className="px-4 py-3 text-house-800 font-medium">
                        {req.name}
                        <div className="text-xs text-house-400 font-normal">{req.grade}</div>
                      </td>
                      <td className="px-4 py-3 text-house-600">{req.phone}</td>
                      <td className="px-4 py-3 text-house-600">{req.courseName}</td>
                      <td className="px-4 py-3 text-house-500">{new Date(req.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="px-4 py-3">
                        <select 
                          className="text-xs border rounded px-2 py-1 bg-white outline-none"
                          value={req.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const res = await fetch(`/api/qiyas_requests/${req.id}`, {
                                method: 'PUT',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                },
                                body: JSON.stringify({ status: newStatus })
                              });
                              if (!res.ok) throw new Error('فشل التحديث');
                              toast.success('تم تحديث حالة الطلب');
                              setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
                            } catch (err) {
                              toast.error('حدث خطأ أثناء تحديث الحالة');
                            }
                          }}
                        >
                          <option value="قيد المراجعة">قيد المراجعة</option>
                          <option value="تم التواصل">تم التواصل</option>
                          <option value="بانتظار الدفع">بانتظار الدفع</option>
                          <option value="تم القبول">تم القبول</option>
                          <option value="مرفوض">مرفوض</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 bg-white p-4 rounded-xl shadow-xl border flex justify-end">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ الدورات'}
          </Button>
        </div>
      </form>
    </div>
  );
}
