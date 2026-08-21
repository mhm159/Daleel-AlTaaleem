'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '../types';

export default function Footer() {
  const [settings, setSettings] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-house-900 text-house-100">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src={settings?.images?.logo || "/logo.png"} alt="شعار مدارس دليل التعلم الأهلية" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">مدارس دليل التعلم</span>
                <span className="text-sm font-medium text-sky-400">الأهلية</span>
              </div>
            </div>
            <p className="text-sm text-house-300">
              عين على تنشئة الجيل
            </p>
            <div className="mt-4 flex gap-3">
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700" aria-label="واتساب">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0111.85 11.85c0 6.555-5.335 11.89-11.89 11.89a11.9 11.9 0 01-5.958-1.547L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885 0-5.452-4.434-9.887-9.886-9.887-5.452 0-9.888 4.435-9.888 9.886 0 1.94.571 3.743 1.585 5.398l-1.06 3.857 3.968-1.04z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-house-800 text-sky-400 transition-colors hover:bg-sky-600 hover:text-white" aria-label="إنستغرام">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-house-800 text-sky-400 transition-colors hover:bg-sky-600 hover:text-white" aria-label="تويتر">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-house-800 text-sky-400 transition-colors hover:bg-sky-600 hover:text-white" aria-label="فيسبوك">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.snapchat} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-black transition-colors hover:bg-yellow-500" aria-label="سناب شات">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.83 0c-1.39 0-3.32.1-4.78.43-.88.2-1.74.52-2.33 1.15C4.24 2.1 4 3 4 4.05v.23c0 .24 0 .47-.03.7-.02.26-.05.52-.09.78a2.53 2.53 0 0 1-1.07 1.63c-.56.36-1.22.56-1.87.56a2 2 0 0 1-.95-.23 1.94 1.94 0 0 1-.8-.85 2.1 2.1 0 0 1-.18-.88c0-.6.28-1.2.7-1.6l.08-.07-.12-.03A5.02 5.02 0 0 0 0 4c-.03.88.25 1.76.77 2.45a3.8 3.8 0 0 0 1.9 1.34c.03.01.07.03.1.04-.15.4-.35.78-.6 1.14-.62.88-1.4 1.64-2.26 2.27l-.1.08c-.02.02-.04.04-.05.06a.37.37 0 0 0 .1.46c.03.02.07.03.1.03a.58.58 0 0 0 .2-.04c.9-.28 1.83-.45 2.77-.5.25-.01.5-.02.76-.02.6 0 1.2.06 1.8.17a5.55 5.55 0 0 1 2.92 1.37c.3.28.57.6.8.94.13.2.26.43.4.67.12.2.27.42.4.64.24.43.5.85.8 1.25.1.1.2.22.3.34.12.12.26.2.43.2.16 0 .3-.08.43-.2.1-.12.2-.23.3-.34.3-.4.56-.82.8-1.25.13-.22.28-.44.4-.64.14-.24.27-.47.4-.67.23-.34.5-.66.8-.94a5.55 5.55 0 0 1 2.92-1.37c.6-.1 1.2-.17 1.8-.17.26 0 .5.01.76.02.94.05 1.87.22 2.77.5.07.02.14.04.2.04a.34.34 0 0 0 .28-.15c.04-.06.03-.13 0-.17a10.2 10.2 0 0 1-2.4-2.4c-.25-.36-.45-.74-.6-1.15.03-.01.07-.03.1-.04a3.8 3.8 0 0 0 1.9-1.34c.52-.7.8-1.57.77-2.45a5.02 5.02 0 0 0-1.85-.43l-.12.03.08.07c.42.4.7 1 .7 1.6 0 .33-.06.63-.18.88a1.94 1.94 0 0 1-.8.85 2 2 0 0 1-.95.23 2.8 2.8 0 0 1-1.87-.56 2.53 2.53 0 0 1-1.07-1.63c-.04-.26-.07-.52-.09-.78a6.5 6.5 0 0 1-.03-.7V4.05c0-1.05-.24-1.95-.73-2.47-.6-.63-1.45-.95-2.33-1.15C15.15.1 13.22 0 11.83 0zM12 18.06c-1.14 0-2.27-.14-3.37-.43-1-.26-1.93-.7-2.73-1.3-.12-.08-.18-.2-.18-.34 0-.15.07-.28.18-.35.1-.07.24-.1.35-.07l1.04.28c.84.23 1.7.35 2.57.37.7 0 1.4 0 2.14-.14h.02c.73.14 1.45.14 2.14.14.87-.02 1.73-.14 2.57-.37l1.04-.28c.1-.03.25 0 .35.07.1.07.18.2.18.35 0 .14-.06.26-.18.34-.8.6-1.73 1.04-2.73 1.3a12.8 12.8 0 0 1-3.37.43z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-house-300 transition-colors hover:text-sky-400">عن المدرسة</Link></li>
              <li><Link href="/admissions" className="text-house-300 transition-colors hover:text-sky-400">القبول والتسجيل</Link></li>
              <li><Link href="/academics" className="text-house-300 transition-colors hover:text-sky-400">الأنشطة الأكاديمية</Link></li>
              <li><Link href="/news" className="text-house-300 transition-colors hover:text-sky-400">الأخبار والفعاليات</Link></li>
              <li><Link href="/portal" className="text-house-300 transition-colors hover:text-sky-400">تسجيل الدخول</Link></li>
              <li><Link href="/contact" className="text-house-300 transition-colors hover:text-sky-400">تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">المراحل الدراسية</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-house-300">مرحلة رياض الأطفال</li>
              <li className="text-house-300">المرحلة الابتدائية</li>
              <li className="text-house-300">المرحلة المتوسطة</li>
              <li className="text-house-300">المرحلة الثانوية</li>
              <li className="text-house-300">الأنشطة اللاصفية</li>
              <li className="text-house-300">البرامج الصيفية</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-house-300">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 flex-shrink-0 text-sky-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>السليل ، الروضة 18211</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="flex-shrink-0 text-sky-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                <span>0562020048</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="flex-shrink-0 text-sky-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>info@dlguide.edu.sa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-house-800 pt-6 text-center text-sm text-house-400">
          <p>© {new Date().getFullYear()} مدارس دليل التعلم الأهلية. جميع الحقوق محفوظة.</p>
          <p className="mt-1">
            <Link href="/privacy" className="hover:text-sky-400">سياسة الخصوصية</Link>
            <span className="mx-2">•</span>
            <Link href="/terms" className="hover:text-sky-400">الشروط والأحكام</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
