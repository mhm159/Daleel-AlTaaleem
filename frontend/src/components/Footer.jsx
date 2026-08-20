'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '../types';

export default function Footer() {
  return (
    <footer className="bg-house-900 text-house-100">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src="/logo.png" alt="شعار مدارس دليل التعلم الأهلية" width={48} height={48} className="object-contain" />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">مدارس دليل التعلم</span>
                <span className="text-sm font-medium text-sky-400">الأهلية</span>
              </div>
            </div>
            <p className="text-sm text-house-300">
              عين على تنشئة الجيل
            </p>
            <div className="mt-4 flex gap-3">
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-house-800 text-sky-400 transition-colors hover:bg-green-600 hover:text-white" aria-label="واتساب">
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
              <li><Link href="/portal" className="text-house-300 transition-colors hover:text-sky-400">بوابة ولي الأمر</Link></li>
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
                <span>السليل ، اروضة 18211</span>
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
