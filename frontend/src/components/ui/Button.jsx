'use client';

import React from 'react';
import Link from 'next/link';

export function Button({ children, variant = 'primary', href, onClick, type = 'button', disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 ';
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40',
    secondary: 'bg-white text-sky-600 border-2 border-sky-500 hover:bg-sky-50',
    gold: 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/40',
    growth: 'bg-growth-500 text-white hover:bg-growth-600 shadow-lg shadow-growth-500/30',
    ghost: 'text-sky-600 hover:bg-sky-50',
  };

  const classes = base + variants[variant] + ' ' + className;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`rounded-2xl bg-white shadow-md border border-house-200 ${hover ? 'card-hover hover:shadow-lg transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({ title, subtitle, center = true, accent = 'sky' }) {
  const accentColor = {
    sky: 'text-sky-600',
    growth: 'text-growth-600',
    gold: 'text-gold-600',
  };

  return (
    <div className={`${center ? 'text-center' : ''} mb-12`}>
      <h2 className="text-3xl md:text-4xl font-bold text-house-800 mb-4">{title}</h2>
      {subtitle && (
        <p className={`text-lg ${accentColor[accent]} ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'sky' }) {
  const variants = {
    sky: 'bg-sky-100 text-sky-700',
    growth: 'bg-growth-100 text-growth-700',
    gold: 'bg-gold-100 text-gold-700',
  };
  return <span className={`badge ${variants[variant]}`}>{children}</span>;
}

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="spinner mr-3"></div>
      <span className="text-house-500">{text}</span>
    </div>
  );
}

export function Alert({ type = 'error', message }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-growth-50 border-growth-200 text-growth-700',
    info: 'bg-sky-50 border-sky-200 text-sky-700',
    warning: 'bg-gold-50 border-gold-200 text-gold-700',
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}
