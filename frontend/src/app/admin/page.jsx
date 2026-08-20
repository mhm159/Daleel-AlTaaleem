'use client';

import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { Card, Button, Alert } from '../../components/ui/Button';
import LoginForm from '../../components/portal/LoginForm';

// Import Admin Components
import Overview from '../../components/admin/Overview';
import NewsManager from '../../components/admin/NewsManager';
import EventsManager from '../../components/admin/EventsManager';
import CalendarManager from '../../components/admin/CalendarManager';
import AdmissionsManager from '../../components/admin/AdmissionsManager';
import StudentsManager from '../../components/admin/StudentsManager';
import PaymentsManager from '../../components/admin/PaymentsManager';
import ContactsManager from '../../components/admin/ContactsManager';
import ExpensesManager from '../../components/admin/ExpensesManager';
import AiMarketingManager from '../../components/admin/AiMarketingManager';

import SettingsManager from '../../components/admin/SettingsManager';

const SIDEBAR = [
  { id: 'overview', label: 'نظرة عامة', icon: '📊' },
  { id: 'news', label: 'الأخبار والمدونة', icon: '📰' },
  { id: 'events', label: 'الفعاليات', icon: '📅' },
  { id: 'calendar', label: 'التقويم الدراسي', icon: '🗓️' },
  { id: 'admissions', label: 'القبول والتسجيل', icon: '📝' },
  { id: 'students', label: 'الطلاب', icon: '🎓' },
  { id: 'payments', label: 'الإيرادات والرسوم', icon: '💳' },
  { id: 'expenses', label: 'المصروفات', icon: '💸' },
  { id: 'contacts', label: 'رسائل التواصل', icon: '✉️' },
  { id: 'marketing', label: 'التسويق (AI)', icon: '🤖' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
];

export default function AdminDashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-house-50 to-white py-16">
        <LoginForm 
          title="تسجيل دخول الإدارة"
          subtitle="يرجى إدخال بيانات الدخول للوصول للوحة تحكم المدرسة"
        />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="py-20 text-center">
        <Alert type="error" message="عفواً، لا تملك صلاحيات لدخول هذه الصفحة." />
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <Overview onNavigate={setActiveTab} />;
      case 'news': return <NewsManager />;
      case 'events': return <EventsManager />;
      case 'calendar': return <CalendarManager />;
      case 'admissions': return <AdmissionsManager />;
      case 'students': return <StudentsManager />;
      case 'payments': return <PaymentsManager />;
      case 'contacts': return <ContactsManager />;
      case 'expenses': return <ExpensesManager />;
      case 'marketing': return <AiMarketingManager />;
      case 'settings': return <SettingsManager />;
      default: return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="bg-house-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-house-800">لوحة تحكم الإدارة</h1>
            <p className="text-house-500 text-sm mt-1">إدارة شاملة لجميع بيانات وأنشطة المدرسة</p>
          </div>
          <Button variant="secondary" onClick={logout}>تسجيل خروج</Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-3 sticky top-8 shadow-md">
              <nav className="space-y-1">
                {SIDEBAR.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left font-medium transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' 
                        : 'text-house-600 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-4 min-h-[600px]">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
