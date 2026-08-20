'use client';

import React from 'react';

export function StatCard({ icon, value, label, color = 'sky' }) {
  const colors = {
    sky: 'from-sky-400 to-sky-600',
    growth: 'from-growth-400 to-growth-600',
    gold: 'from-gold-400 to-gold-600',
  };

  return (
    <div className="flex items-center space-x-4 rounded-2xl bg-white p-6 shadow-sm border border-house-100">
      <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-house-800">{value}</div>
        <div className="text-sm text-house-500">{label}</div>
      </div>
    </div>
  );
}
