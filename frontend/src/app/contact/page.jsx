'use client';

import React, { useState } from 'react';
import { api } from '../../lib/api';
import { SectionHeading, Card, Button, Alert, Loader } from '../../components/ui/Button';
import { SOCIAL_LINKS } from '../../types';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '', category: 'general',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await api.post('/contacts', formData);
      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });
      }
    } catch (err) {
      setError(err.message || 'فشل إرسال الرسالة، يرجى المحاولة مجدداً');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-growth-100 text-growth-600">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-2xl font-bold text-house-800">تم إرسال رسالتك بنجاح!</h3>
        <p className="mt-2 text-house-500">شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.</p>
        <Button variant="secondary" className="mt-4" onClick={() => setSuccess(false)}>إرسال رسالة أخرى</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="input-label">الاسم الكامل *</label>
            <input className="input-field" required value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>
          <div>
            <label className="input-label">البريد الإلكتروني *</label>
            <input type="email" className="input-field" required value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <div>
            <label className="input-label">رقم الجوال</label>
            <input className="input-field" placeholder="05xxxxxxxx" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </div>
          <div>
            <label className="input-label">التصنيف</label>
            <select className="input-field" value={formData.category} onChange={(e) => updateField('category', e.target.value)}>
              <option value="general">استفسار عام</option>
              <option value="admission">القبول والتسجيل</option>
              <option value="academic">شؤون أكاديمية</option>
              <option value="payment">الرسوم والمدفوعات</option>
              <option value="complaint">شكوى</option>
              <option value="suggestion">اقتراح</option>
            </select>
          </div>
        </div>
        <div>
          <label className="input-label">الموضوع *</label>
          <input className="input-field" required value={formData.subject} onChange={(e) => updateField('subject', e.target.value)} />
        </div>
        <div>
          <label className="input-label">الرسالة *</label>
          <textarea className="input-field" rows="5" required value={formData.message} onChange={(e) => updateField('message', e.target.value)}></textarea>
        </div>
        <Button type="submit" variant="primary" disabled={submitting} className="w-full">
          {submitting ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
        </Button>
      </form>
    </Card>
  );
}

function MapSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="موقعنا" subtitle="نقع في قلب الرياض، يسهل الوصول إلينا من جميع الأحياء" accent="sky" />
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.793483181!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1699000000000!5m2!1sar!2ssa"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع مدارس دليل التعلم الأهلية"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

function InfoSection() {
  const info = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      title: 'العنوان',
      content: 'حي العليا، شارع التعليم، الرياض 12345، المملكة العربية السعودية',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
      title: 'الهاتف',
      content: '966+ 11 234 5678\n966+ 50 123 4567',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      title: 'البريد الإلكتروني',
      content: 'info@dlguide.edu.sa\nadmissions@dlguide.edu.sa',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      title: 'ساعات الدوام',
      content: 'الأحد - الخميس: 7:00 ص - 3:00 م\nالجمعة - السبت: مغلق',
    },
  ];

  return (
    <section className="py-16 section-sky">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {info.map((item, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                {item.icon}
              </div>
              <h3 className="mb-2 font-bold text-house-800">{item.title}</h3>
              <p className="whitespace-pre-line text-sm text-house-500">{item.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="text-3xl font-bold text-house-800">تابعنا على وسائل التواصل</h2>
        <p className="mt-3 text-house-500">تابع حساباتنا للاطلاع على أحدث الأخبار والفعاليات والمستجدات.</p>
        <div className="mt-8 flex justify-center gap-4">
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-growth-500 text-white shadow-lg transition-transform hover:scale-110" aria-label="واتساب">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0111.85 11.85c0 6.555-5.335 11.89-11.89 11.89a11.9 11.9 0 01-5.958-1.547L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885 0-5.452-4.434-9.887-9.886-9.887-5.452 0-9.888 4.435-9.888 9.886 0 1.94.571 3.743 1.585 5.398l-1.06 3.857 3.968-1.04z"/></svg>
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg transition-transform hover:scale-110" aria-label="إنستغرام">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
          </a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg transition-transform hover:scale-110" aria-label="تويتر">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110" aria-label="فيسبوك">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-sky-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <span className="badge badge-sky">تواصل معنا</span>
          <h1 className="mt-4 text-4xl font-bold text-house-800 md:text-5xl">يسعدنا التواصل معكم</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-house-500">
            لديك استفسار عن القبول أو البرامج الدراسية أو أي شيء آخر؟ فريقنا في خدمتك.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-house-800">أرسل لنا رسالة</h2>
              <ContactForm />
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-bold text-house-800">تواصل مباشر</h2>
              <div className="space-y-4">
                <Card className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-house-800">الهاتف</div>
                    <a href="tel:+966112345678" className="text-sky-600">966+ 11 234 5678</a>
                  </div>
                </Card>
                <Card className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-growth-100 text-growth-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-house-800">البريد الإلكتروني</div>
                    <a href="mailto:info@dlguide.edu.sa" className="text-growth-600">info@dlguide.edu.sa</a>
                  </div>
                </Card>
                <Card className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0111.85 11.85c0 6.555-5.335 11.89-11.89 11.89a11.9 11.9 0 01-5.958-1.547L.057 24z"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-house-800">واتساب</div>
                    <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gold-600">تواصل عبر واتساب</a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MapSection />
      <InfoSection />
      <SocialSection />
    </>
  );
}
