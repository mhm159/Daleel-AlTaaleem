'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Card, Loader } from '../../ui/Button';

export default function StudentsManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await api.get('/students?limit=50');
      setStudents(data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">سجلات الطلاب</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الصف الدراسي</th>
                <th>رقم القبول</th>
                <th>ولي الأمر</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-house-50 transition-colors">
                  <td className="font-medium">{s.firstName} {s.lastName}</td>
                  <td>{s.gradeLevel}</td>
                  <td className="font-mono text-sm">{s.admissionNumber}</td>
                  <td className="text-house-500">{s.parentId?.name || 'غير متوفر'}</td>
                  <td><span className={`badge ${s.status === 'active' ? 'badge-growth' : 'badge-gold'}`}>{s.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-house-500">لا يوجد طلاب حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
