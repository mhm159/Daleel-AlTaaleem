'use client';

import React, { useState } from 'react';
import { Card, Button, Loader } from '../../ui/Button';

export default function ExpensesManager() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'صيانة مباني', amount: 5000, date: '2026-08-15', category: 'صيانة' },
    { id: 2, title: 'رواتب معلمين', amount: 150000, date: '2026-07-28', category: 'رواتب' },
  ]);
  
  const [form, setForm] = useState({ title: '', amount: '', date: '', category: 'رواتب' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount)
    };
    setExpenses([newExpense, ...expenses]);
    setForm({ title: '', amount: '', date: '', category: 'رواتب' });
    alert('تم إضافة المصروف بنجاح (نسخة تجريبية)');
  };

  const handleDelete = (id) => {
    if(confirm('هل تريد حذف هذا السجل؟')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إدارة المصروفات</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ريال
          </div>
          <div className="text-sm text-house-500">إجمالي المصروفات</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-house-800">إضافة مصروف جديد</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="input-label">البيان / الوصف</label>
              <input className="input-field" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="input-label">المبلغ (ريال)</label>
              <input type="number" min="0" className="input-field" required value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} />
            </div>
            <div>
              <label className="input-label">التصنيف</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="رواتب">رواتب</option>
                <option value="صيانة">صيانة</option>
                <option value="مرافق">مرافق وفواتير</option>
                <option value="أنشطة">أنشطة</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
            <div>
              <label className="input-label">التاريخ</label>
              <input type="date" className="input-field" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
          </div>
          <Button type="submit" variant="primary">تسجيل المصروف</Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>البيان</th>
                <th>التصنيف</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-house-50 transition-colors">
                  <td className="font-medium text-house-800">{e.title}</td>
                  <td><span className="badge badge-sky">{e.category}</span></td>
                  <td className="font-semibold text-red-600">ريال {e.amount.toLocaleString()}</td>
                  <td className="text-house-500">{new Date(e.date).toLocaleDateString('ar-SA')}</td>
                  <td>
                    <Button variant="ghost" className="text-red-600 text-sm hover:bg-red-50" onClick={() => handleDelete(e.id)}>حذف</Button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-house-500">لا توجد مصروفات مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
