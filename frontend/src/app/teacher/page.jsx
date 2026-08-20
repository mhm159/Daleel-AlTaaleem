'use client';

import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { Alert, Button, Card } from '../../components/ui/Button';
import LoginForm from '../../components/portal/LoginForm';
import TeacherDashboard from '../../components/teacher/TeacherDashboard';

export default function TeacherPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-house-50 to-white py-16">
        <LoginForm 
          title="بوابة المعلمين"
          subtitle="سجل دخولك لإدارة فصولك وطلابك"
        />
      </div>
    );
  }

  // السماح للمعلم أو الإداري بدخول بوابة المعلم للتجربة
  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="py-20 text-center">
        <Alert type="error" message="عفواً، هذه الصفحة مخصصة للمعلمين فقط." />
      </div>
    );
  }

  const TABS = [
    { id: 'schedule', label: 'الجدول الدراسي', icon: '📅' },
    { id: 'attendance', label: 'رصد الغياب', icon: '✔️' },
    { id: 'grades', label: 'رصد الدرجات', icon: '📝' },
  ];

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-house-800">بوابة المعلم</h1>
            <p className="text-house-500 mt-1">أهلاً بك أستاذ/ة {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout}>تسجيل الخروج</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-3 sticky top-8">
              <nav className="space-y-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-house-600 hover:bg-sky-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <TeacherDashboard activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
