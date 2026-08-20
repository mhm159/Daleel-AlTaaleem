'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Loader, Alert } from '../ui/Button';
import toast from 'react-hot-toast';

export default function TuitionManager() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
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
      if (!res.ok) throw new Error('فشل حفظ المصروفات');
      toast.success('تم حفظ المصروفات الدراسية بنجاح!');
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateGrade = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      grades: prev.grades.map(g => g.id === id ? { ...g, [field]: value } : g)
    }));
  };

  const removeGrade = (id) => {
    setSettings(prev => ({
      ...prev,
      grades: prev.grades.filter(g => g.id !== id)
    }));
  };

  const addGrade = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setSettings(prev => ({
      ...prev,
      grades: [...(prev.grades || []), { id, name: 'مرحلة جديدة', fee: 0 }]
    }));
  };

  if (!settings) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إدارة المصروفات الدراسية</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        {error && <Alert type="error" message={error} />}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-house-800">المراحل الدراسية والرسوم</h3>
            <Button type="button" variant="secondary" onClick={addGrade} className="text-sm px-3 py-1">
              + إضافة مرحلة
            </Button>
          </div>
          
          <div className="mb-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
            <label className="input-label text-gold-800">رسوم التسجيل الموحدة (تدفع مرة واحدة)</label>
            <div className="flex items-center gap-2 max-w-xs">
              <input 
                type="number" 
                className="input-field" 
                value={settings.registrationFee || 0} 
                onChange={(e) => setSettings(prev => ({ ...prev, registrationFee: Number(e.target.value) }))} 
              />
              <span className="text-house-500">ريال</span>
            </div>
          </div>

          <div className="space-y-3">
            {settings.grades?.map((grade) => (
              <div key={grade.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border rounded-lg hover:border-sky-300 transition-colors">
                <div className="flex-1 w-full">
                  <label className="text-xs text-house-500 mb-1 block">اسم المرحلة</label>
                  <input className="input-field" value={grade.name} onChange={(e) => updateGrade(grade.id, 'name', e.target.value)} />
                </div>
                <div className="w-full sm:w-48">
                  <label className="text-xs text-house-500 mb-1 block">الرسوم السنوية (ريال)</label>
                  <input type="number" className="input-field" value={grade.fee} onChange={(e) => updateGrade(grade.id, 'fee', Number(e.target.value))} />
                </div>
                <button type="button" onClick={() => removeGrade(grade.id)} className="mt-5 text-red-500 hover:text-red-700 p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            ))}
            {(!settings.grades || settings.grades.length === 0) && <p className="text-house-400 text-center py-4">لا توجد مراحل دراسية مضافة.</p>}
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 bg-white p-4 rounded-xl shadow-xl border flex justify-end">
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ المصروفات'}
          </Button>
        </div>
      </form>
    </div>
  );
}
