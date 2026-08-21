'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Loader, Alert } from '../ui/Button';
import toast from 'react-hot-toast';

export default function SettingsManager() {
  const [logoUrl, setLogoUrl] = useState('');
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load settings from API
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
      })
      .catch(console.error);
  }, []);

  const updateImage = (field, value) => {
    setSettings(prev => ({
      ...prev,
      images: { ...prev.images, [field]: value }
    }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('حجم الصورة كبير جداً. الحد الأقصى هو 2 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateImage(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('فشل حفظ الإعدادات');
      toast.success('تم حفظ بيانات الموقع بنجاح!');
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateHomepage = (field, value) => {
    setSettings(prev => ({
      ...prev,
      homepage: { ...prev.homepage, [field]: value }
    }));
  };



  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إعدادات الموقع الشاملة</h2>

      {!settings ? <Loader /> : (
        <form onSubmit={handleSettingsSave} className="space-y-6">
          {error && <Alert type="error" message={error} />}

          {/* Images Settings */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-house-800">إدارة الصور والهوية البصرية</h3>
            <p className="text-sm text-house-500 mb-4">ضع روابط الصور هنا (يمكنك استخدام روابط خارجية أو مسارات محلية مثل /logo.png)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">شعار المدرسة</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" className="input-field text-sm" onChange={(e) => handleImageUpload('logo', e)} />
                  <input type="text" placeholder="أو أدخل الرابط..." className="input-field text-sm" value={settings.images?.logo || ''} onChange={(e) => updateImage('logo', e.target.value)} />
                </div>
                {settings.images?.logo && <img src={settings.images.logo} alt="preview" className="h-16 mt-2 object-contain bg-house-50 p-2 rounded border" />}
              </div>
              <div className="md:col-span-2">
                <label className="input-label font-bold text-lg mb-2 block">صور الإطار المتحرك (Carousel Images)</label>
                <div className="space-y-4">
                  {(settings.images?.carouselImages || []).map((img, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-house-50 p-4 rounded border">
                      {/* Image Preview */}
                      {img.url ? (
                        <img src={img.url} alt={`Carousel ${index}`} className="w-24 h-32 object-cover rounded border bg-white" />
                      ) : (
                        <div className="w-24 h-32 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">لا توجد صورة</div>
                      )}
                      
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="input-field text-sm flex-1" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) { toast.error('حجم الصورة كبير جداً'); return; }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newImages = [...(settings.images.carouselImages || [])];
                                  newImages[index].url = reader.result;
                                  updateImage('carouselImages', newImages);
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                          <input 
                            type="text" 
                            placeholder="أو أدخل الرابط..." 
                            className="input-field text-sm flex-1" 
                            value={img.url || ''} 
                            onChange={(e) => {
                              const newImages = [...(settings.images.carouselImages || [])];
                              newImages[index].url = e.target.value;
                              updateImage('carouselImages', newImages);
                            }} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={img.active !== false}
                              onChange={(e) => {
                                const newImages = [...(settings.images.carouselImages || [])];
                                newImages[index].active = e.target.checked;
                                updateImage('carouselImages', newImages);
                              }}
                              className="w-4 h-4 text-growth-600 rounded"
                            />
                            <span className="text-sm font-medium text-house-700">{img.active !== false ? 'مفعل (يظهر في الموقع)' : 'معطل (مخفي)'}</span>
                          </label>
                          <Button 
                            type="button"
                            variant="danger"
                            className="px-3 py-1 text-xs bg-red-100 text-red-600 hover:bg-red-200 border-0"
                            onClick={() => {
                              const newImages = settings.images.carouselImages.filter((_, i) => i !== index);
                              updateImage('carouselImages', newImages);
                            }}
                          >
                            حذف الصورة
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full py-3 border-dashed border-2 bg-transparent text-house-600 hover:bg-house-50"
                    onClick={() => {
                      const newImages = [...(settings.images?.carouselImages || []), { url: '', active: true }];
                      updateImage('carouselImages', newImages);
                    }}
                  >
                    + إضافة صورة جديدة للألبوم
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="input-label">صورة صفحة "عن المدرسة"</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" className="input-field text-sm" onChange={(e) => handleImageUpload('aboutHero', e)} />
                  <input type="text" placeholder="أو أدخل الرابط..." className="input-field text-sm" value={settings.images?.aboutHero || ''} onChange={(e) => updateImage('aboutHero', e.target.value)} />
                </div>
                {settings.images?.aboutHero && <img src={settings.images.aboutHero} alt="preview" className="h-24 mt-2 object-cover bg-house-50 p-2 rounded border w-full max-w-sm" />}
              </div>
            </div>
          </Card>
          {error && <Alert type="error" message={error} />}
          
          {/* Homepage Text */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-house-800">نصوص الصفحة الرئيسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">العنوان الأول</label>
                <input className="input-field" value={settings.homepage?.heroTitle1 || ''} onChange={(e) => updateHomepage('heroTitle1', e.target.value)} />
              </div>
              <div>
                <label className="input-label">كلمة مميزة (العنوان الأول)</label>
                <input className="input-field" value={settings.homepage?.heroTitleAccent1 || ''} onChange={(e) => updateHomepage('heroTitleAccent1', e.target.value)} />
              </div>
              <div>
                <label className="input-label">العنوان الثاني</label>
                <input className="input-field" value={settings.homepage?.heroTitle2 || ''} onChange={(e) => updateHomepage('heroTitle2', e.target.value)} />
              </div>
              <div>
                <label className="input-label">كلمة مميزة (العنوان الثاني)</label>
                <input className="input-field" value={settings.homepage?.heroTitleAccent2 || ''} onChange={(e) => updateHomepage('heroTitleAccent2', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="input-label">النص الفرعي (الوصف)</label>
                <textarea className="input-field" rows="3" value={settings.homepage?.heroSubtitle || ''} onChange={(e) => updateHomepage('heroSubtitle', e.target.value)}></textarea>
              </div>
            </div>

            <h4 className="mt-6 mb-4 font-medium text-house-800">الإحصائيات السريعة</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 p-3 bg-house-50 rounded-lg border">
                <label className="text-xs text-house-500">الإحصائية 1</label>
                <input className="input-field" placeholder="القيمة (مثال: +15)" value={settings.homepage?.stat1Value || ''} onChange={(e) => updateHomepage('stat1Value', e.target.value)} />
                <input className="input-field" placeholder="الوصف" value={settings.homepage?.stat1Label || ''} onChange={(e) => updateHomepage('stat1Label', e.target.value)} />
              </div>
              <div className="space-y-2 p-3 bg-house-50 rounded-lg border">
                <label className="text-xs text-house-500">الإحصائية 2</label>
                <input className="input-field" placeholder="القيمة" value={settings.homepage?.stat2Value || ''} onChange={(e) => updateHomepage('stat2Value', e.target.value)} />
                <input className="input-field" placeholder="الوصف" value={settings.homepage?.stat2Label || ''} onChange={(e) => updateHomepage('stat2Label', e.target.value)} />
              </div>
              <div className="space-y-2 p-3 bg-house-50 rounded-lg border">
                <label className="text-xs text-house-500">الإحصائية 3</label>
                <input className="input-field" placeholder="القيمة" value={settings.homepage?.stat3Value || ''} onChange={(e) => updateHomepage('stat3Value', e.target.value)} />
                <input className="input-field" placeholder="الوصف" value={settings.homepage?.stat3Label || ''} onChange={(e) => updateHomepage('stat3Label', e.target.value)} />
              </div>
            </div>
          </Card>

          {/* AI Settings */}
          <Card className="p-6 border-sky-200 bg-sky-50/30">
            <h3 className="mb-4 font-semibold text-house-800 flex items-center gap-2">
              <span className="text-xl">🤖</span> إعدادات الذكاء الاصطناعي لتوليد المحتوى
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">مزود الخدمة (AI Provider)</label>
                <select 
                  className="input-field" 
                  value={settings.aiSettings?.provider || 'gemini'} 
                  onChange={(e) => setSettings(prev => ({ ...prev, aiSettings: { ...prev.aiSettings, provider: e.target.value } }))}
                >
                  <option value="gemini">Google Gemini (موصى به للمدارس)</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                </select>
              </div>
              <div>
                <label className="input-label">مفتاح الـ API (API Key)</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    className="input-field flex-1" 
                    placeholder="أدخل مفتاح الـ API هنا..."
                    value={settings.aiSettings?.apiKey || ''} 
                    onChange={(e) => setSettings(prev => ({ ...prev, aiSettings: { ...prev.aiSettings, apiKey: e.target.value } }))}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="px-4 py-2 text-sm whitespace-nowrap"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ title: 'test', promptType: 'test' })
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                          toast.success(data.message);
                        } else {
                          throw new Error(data.error || 'فشل الاتصال');
                        }
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }}
                  >
                    تحقق من الاتصال
                  </Button>
                </div>
                <p className="mt-1 text-xs text-house-500">سيتم استخدام هذا المفتاح في توليد الأخبار والمدونات والصور بشكل آلي.</p>
              </div>
            </div>
          </Card>

          <div className="sticky bottom-4 z-10 bg-white p-4 rounded-xl shadow-xl border flex justify-end">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'جارٍ الحفظ...' : 'حفظ بيانات الموقع'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
