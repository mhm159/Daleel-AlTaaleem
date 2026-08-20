'use client';

import React, { useState } from 'react';
import { Card, Button } from '../ui/Button';

export default function AiMarketingManager() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if(!prompt) return;
    
    setGenerating(true);
    // محاكاة لعملية توليد الذكاء الاصطناعي
    setTimeout(() => {
      setResult({
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop', // صورة تعليمية
        text: `🚀 افتح أبواب المستقبل لأبنائك! \n\n${prompt}\n\nسجل الآن في مدرستنا واستفد من بيئة تعليمية محفزة ومناهج مبتكرة تضمن التفوق والنجاح.\n\n#التعليم #مستقبل_أفضل #التسجيل_مفتوح`
      });
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">التسويق بالذكاء الاصطناعي 🤖</h2>
      <p className="text-house-500">قم بتوليد نصوص وصور تسويقية لحسابات المدرسة على السوشيال ميديا بضغطة زر.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-house-800">اكتب فكرة الإعلان</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="input-label">عن ماذا يتحدث الإعلان؟ (مثال: فتح باب القبول للعام الجديد، خصم للإخوة...)</label>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="أدخل فكرة الإعلان هنا..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={generating}>
              {generating ? 'جاري التوليد بالذكاء الاصطناعي ⏳...' : 'توليد الإعلان ✨'}
            </Button>
          </form>
        </Card>

        {result && (
          <Card className="p-6 border-2 border-sky-400 bg-sky-50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-sky-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
              نتيجة AI
            </div>
            <h3 className="mb-4 font-semibold text-house-800">النتيجة المقترحة</h3>
            <div className="space-y-4">
              <img src={result.image} alt="Generated AI" className="w-full h-48 object-cover rounded-lg shadow-sm" />
              <div className="p-4 bg-white rounded-lg border border-sky-100">
                <p className="text-house-700 whitespace-pre-wrap text-sm leading-relaxed">{result.text}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => toast('تم النسخ للحافظة')} className="flex-1">نسخ النص</Button>
                <Button variant="gold" className="flex-1">تحميل الصورة</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
