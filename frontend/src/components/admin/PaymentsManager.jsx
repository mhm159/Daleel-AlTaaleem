'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, Loader } from '../ui/Button';

export default function PaymentsManager() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await api.get('/payments?limit=50');
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">سجلات الإيرادات والرسوم</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>ولي الأمر</th>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-house-50 transition-colors">
                  <td className="font-mono text-sm">{p.invoiceNumber}</td>
                  <td>{p.userId?.name || 'غير متوفر'}</td>
                  <td>{p.type}</td>
                  <td className="font-semibold">ريال {p.amount.toLocaleString()}</td>
                  <td><span className={`badge ${p.status === 'completed' ? 'badge-growth' : 'badge-gold'}`}>{p.status === 'completed' ? 'مكتمل' : 'معلق'}</span></td>
                  <td className="text-house-400">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-house-500">لا توجد سجلات مدفوعات حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
