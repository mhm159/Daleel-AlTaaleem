'use client';

import React, { useState } from 'react';
import { Card, Button } from '../ui/Button';

export default function TeacherDashboard({ activeTab }) {
  
  const ScheduleTab = () => (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">الجدول الدراسي للحصص</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>اليوم</th>
                <th>الحصة 1</th>
                <th>الحصة 2</th>
                <th>الحصة 3</th>
                <th>الحصة 4</th>
                <th>الحصة 5</th>
              </tr>
            </thead>
            <tbody>
              {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day) => (
                <tr key={day} className="hover:bg-house-50 transition-colors">
                  <td className="font-bold text-house-700">{day}</td>
                  <td><div className="p-2 bg-sky-50 rounded border border-sky-100 text-sm">الصف 1/أ<br/><span className="text-xs text-sky-600">رياضيات</span></div></td>
                  <td><div className="p-2 bg-growth-50 rounded border border-growth-100 text-sm">الصف 2/ب<br/><span className="text-xs text-growth-600">رياضيات</span></div></td>
                  <td>-</td>
                  <td><div className="p-2 bg-gold-50 rounded border border-gold-100 text-sm">الصف 3/ج<br/><span className="text-xs text-gold-600">رياضيات</span></div></td>
                  <td>-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const AttendanceTab = () => {
    const [selectedClass, setSelectedClass] = useState('1/أ');
    const [students, setStudents] = useState([
      { id: 1, name: 'أحمد محمد', status: 'present' },
      { id: 2, name: 'سالم عبدالله', status: 'absent' },
      { id: 3, name: 'خالد عبدالعزيز', status: 'present' },
      { id: 4, name: 'عمر فهد', status: 'late' },
    ]);

    const handleStatusChange = (id, newStatus) => {
      setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-house-800">رصد الغياب اليومي</h2>
          <select 
            className="input-field max-w-xs" 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="1/أ">الصف الأول - أ</option>
            <option value="2/ب">الصف الثاني - ب</option>
            <option value="3/ج">الصف الثالث - ج</option>
          </select>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-house-800">تاريخ اليوم: {new Date().toLocaleDateString('ar-SA')}</h3>
            <Button variant="primary" onClick={() => toast.success('تم حفظ سجل الغياب بنجاح')}>حفظ السجل</Button>
          </div>
          
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-sky-300">
                <span className="font-medium text-house-800">{student.name}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${student.status === 'present' ? 'bg-growth-500 text-white' : 'bg-house-100 hover:bg-growth-100'}`}
                  >حاضر</button>
                  <button 
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${student.status === 'absent' ? 'bg-red-500 text-white' : 'bg-house-100 hover:bg-red-100'}`}
                  >غائب</button>
                  <button 
                    onClick={() => handleStatusChange(student.id, 'late')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${student.status === 'late' ? 'bg-gold-500 text-white' : 'bg-house-100 hover:bg-gold-100'}`}
                  >متأخر</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const GradesTab = () => {
    const [selectedClass, setSelectedClass] = useState('1/أ');
    const [selectedSubject, setSelectedSubject] = useState('رياضيات');
    const [students, setStudents] = useState([
      { id: 1, name: 'أحمد محمد', grade: 95 },
      { id: 2, name: 'سالم عبدالله', grade: 78 },
      { id: 3, name: 'خالد عبدالعزيز', grade: 88 },
      { id: 4, name: 'عمر فهد', grade: 92 },
    ]);

    const handleGradeChange = (id, newGrade) => {
      setStudents(students.map(s => s.id === id ? { ...s, grade: newGrade } : s));
    };

    return (
      <div className="space-y-6 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-house-800">رصد درجات الاختبارات</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">الصف</label>
            <select className="input-field" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="1/أ">الصف الأول - أ</option>
              <option value="2/ب">الصف الثاني - ب</option>
            </select>
          </div>
          <div>
            <label className="input-label">المادة</label>
            <select className="input-field" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="رياضيات">الرياضيات</option>
              <option value="علوم">العلوم</option>
            </select>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-house-800">سجل الدرجات - اختبار الفترة الأولى</h3>
            <Button variant="primary" onClick={() => toast.success('تم حفظ الدرجات بنجاح')}>حفظ الدرجات</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-modern w-full">
              <thead>
                <tr>
                  <th>اسم الطالب</th>
                  <th>الدرجة (من 100)</th>
                  <th>التقدير</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium text-house-800">{student.name}</td>
                    <td>
                      <input 
                        type="number" 
                        min="0" max="100" 
                        className="input-field max-w-[100px] text-center" 
                        value={student.grade} 
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <span className={`badge ${student.grade >= 90 ? 'badge-growth' : student.grade >= 75 ? 'badge-sky' : student.grade >= 60 ? 'badge-gold' : 'bg-red-100 text-red-700'}`}>
                        {student.grade >= 90 ? 'ممتاز' : student.grade >= 75 ? 'جيد جداً' : student.grade >= 60 ? 'جيد' : 'ضعيف'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  switch (activeTab) {
    case 'schedule': return <ScheduleTab />;
    case 'attendance': return <AttendanceTab />;
    case 'grades': return <GradesTab />;
    default: return <ScheduleTab />;
  }
}
