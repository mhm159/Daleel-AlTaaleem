'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Card, Button, Loader } from '../../ui/Button';

export default function Overview({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/students?limit=1'),
      api.get('/admissions/admin/all?limit=1'),
      api.get('/news/admin/all?limit=1'),
      api.get('/payments/stats'),
      api.get('/contacts'),
    ]).then(([students, admissions, news, payments, contacts]) => {
      setStats({
        students: students.pagination?.total || 0,
        admissions: admissions.pagination?.total || 0,
        pendingAdmissions: admissions.admissions?.filter(a => a.status === 'pending').length || 0,
        news: news.pagination?.total || 0,
        revenue: payments.stats?.thisMonthRevenue || 0,
        contacts: contacts.summary?.new || 0,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'إجمالي الطلاب', value: stats.students, color: 'sky', icon: '🎓' },
    { label: 'إجمالي الطلبات', value: stats.admissions, color: 'growth', icon: '📝' },
    { label: 'الطلبات المعلقة', value: stats.pendingAdmissions, color: 'gold', icon: '⏳' },
    { label: 'المقالات الإخبارية', value: stats.news, color: 'sky', icon: '📰' },
    { label: 'إيرادات هذا الشهر', value: `ريال ${stats.revenue.toLocaleString()}`, color: 'growth', icon: '💰' },
    { label: 'الرسائل الجديدة', value: stats.contacts, color: 'gold', icon: '✉️' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">نظرة عامة على لوحة القيادة</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-house-800">{c.value}</div>
                <div className="text-sm text-house-500 mt-1">{c.label}</div>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${c.color}-100 text-2xl shadow-inner`}>
                {c.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h3 className="mb-4 font-bold text-house-800">إجراءات سريعة</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => onNavigate('news')}>نشر خبر</Button>
          <Button variant="growth" onClick={() => onNavigate('admissions')}>مراجعة الطلبات</Button>
          <Button variant="gold" onClick={() => onNavigate('events')}>إضافة فعالية</Button>
          <Button variant="secondary" onClick={() => onNavigate('contacts')}>عرض الرسائل</Button>
        </div>
      </Card>
    </div>
  );
}
