'use client';

import React, { useEffect, useState } from 'react';

export default function Error({ error, reset }) {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    console.error('Server error intercepted:', error);
  }, [error]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-house-50 to-white flex flex-col items-center justify-center p-4">
      
      {/* Animation Container */}
      <div className="relative w-64 h-32 mb-8 flex items-center justify-center">
        {/* Logo */}
        <div 
          className={`absolute transition-all duration-1000 ease-in-out transform ${
            showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
          }`}
        >
           <img src="/logo.png" alt="شعار المدارس" className="w-24 h-24 object-contain" />
        </div>

        {/* Text */}
        <div 
          className={`absolute text-center transition-all duration-1000 ease-in-out transform ${
            !showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
           <p className="text-2xl font-extrabold text-sky-700 drop-shadow-sm">عينٌ على تنشئة الجيل</p>
        </div>
      </div>
      
      {/* Message Card */}
      <div className="text-center max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="mb-4 text-amber-500 flex justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83m0 0l-3.29-3.29a3.753 3.753 0 00-5.3 0L3.62 11.08a3.753 3.753 0 000 5.3l3.29 3.29m8.34-8.34L17 5" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-house-900 mb-4 tracking-tight">النظام في وضع الصيانة حالياً</h2>
        <p className="text-house-600 mb-8 leading-relaxed text-lg">
          نعمل حالياً على إجراء تحديثات تطويرية هامة لضمان تقديم أفضل تجربة تعليمية لطلابنا وأولياء الأمور. سنعود للعمل في أسرع وقت!
        </p>
        <button
          className="btn-primary w-full py-3 text-lg font-bold bg-sky-600 hover:bg-sky-700 shadow-sky-500/30 transition-all hover:-translate-y-1"
          onClick={() => reset()}
        >
          تحديث الصفحة
        </button>
      </div>
    </div>
  );
}
