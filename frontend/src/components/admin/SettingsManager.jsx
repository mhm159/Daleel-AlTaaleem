'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../ui/Button';

export default function SettingsManager() {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('school_logo');
    if (saved) {
      setLogoUrl(saved);
    } else {
      setLogoUrl('/logo.png'); // default
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('school_logo', logoUrl);
    
    // Update favicon immediately
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = logoUrl;
    
    // Dispatch a custom event so other components (like Navbar) can update
    window.dispatchEvent(new Event('logoChanged'));
    
    alert('تم حفظ الإعدادات وتحديث الشعار بنجاح!');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إعدادات الموقع</h2>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-house-800">الهوية البصرية</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="input-label">رابط شعار المدرسة (أيقونة التبويب والموقع)</label>
            <input 
              className="input-field" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)} 
              placeholder="مثال: /logo.png أو رابط صورة خارجي"
            />
            <p className="mt-1 text-xs text-house-500">
              لتغيير الشعار في شريط المتصفح (Favicon) وفي أعلى الموقع، أدخل رابط الصورة هنا.
            </p>
          </div>
          
          <div className="mt-4 p-4 border rounded-lg bg-house-50 inline-block">
            <p className="text-sm font-medium mb-2">معاينة الشعار الحالي:</p>
            {logoUrl && <img src={logoUrl} alt="Logo preview" className="h-16 object-contain" onError={(e) => e.target.style.display='none'} />}
          </div>

          <div>
            <Button type="submit" variant="primary">حفظ التغييرات</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
