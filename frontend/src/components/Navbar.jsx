'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '../types';
import { useAuth } from './AuthContext';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo (Right) */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.png" alt="شعار مدارس دليل التعلم الأهلية" width={52} height={52} className="object-contain" />
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-house-800">مدارس دليل التعلم</span>
              <span className="text-xs font-medium leading-tight text-sky-600">الأهلية</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav (Center) */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-3 xl:gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm whitespace-nowrap ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions (Left) */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <Link href="/portal" className="hidden lg:inline-flex btn-primary text-sm shrink-0">
            {isAuthenticated ? 'لوحة التحكم' : 'بوابة ولي الأمر'}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-house-800 hover:bg-sky-50 lg:hidden"
            aria-label="القائمة"
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="mx-auto max-w-7xl space-y-1 px-4 pb-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-4 py-2 text-sm font-medium text-house-700 hover:bg-sky-50 hover:text-sky-700"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/portal" className="mt-2 block btn-primary text-center text-sm">
            {isAuthenticated ? 'لوحة التحكم' : 'بوابة ولي الأمر'}
          </Link>
        </div>
      </div>
    </header>
  );
}
