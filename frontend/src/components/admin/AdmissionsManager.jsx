'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Card, Loader } from '../../ui/Button';

export default function AdmissionsManager() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    try {
      const data = await api.get('/admissions/admin/all?limit=50');
      setAdmissions(data.admissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admissions/${id}/status`, { status });
      loadAdmissions();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">طلبات التقديم والقبول</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>اسم الطالب</th>
                <th>الصف الدراسي</th>
                <th>البريد الإلكتروني لولي الأمر</th>
                <th>الحالة</th>
                <th>تاريخ التقديم</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <tr key={a._id} className="hover:bg-house-50 transition-colors">
                  <td className="font-medium">{a.firstName} {a.lastName}</td>
                  <td>{a.gradeApplyingFor}</td>
                  <td className="text-house-500">{a.parentEmail}</td>
                  <td>
                    <span className={`badge ${a.status === 'accepted' ? 'badge-growth' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'badge-gold'}`}>
                      {a.status === 'pending' ? 'قيد الانتظار' : a.status === 'reviewing' ? 'قيد المراجعة' : a.status === 'interview_scheduled' ? 'تم تحديد مقابلة' : a.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                    </span>
                  </td>
                  <td className="text-house-400">{new Date(a.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td>
                    <select
                      className="input-field py-1 text-sm border-gray-300 rounded"
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="reviewing">قيد المراجعة</option>
                      <option value="interview_scheduled">مقابلة</option>
                      <option value="accepted">قبول</option>
                      <option value="rejected">رفض</option>
                    </select>
                  </td>
                </tr>
              ))}
              {admissions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-house-500">لا توجد طلبات تقديم حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
