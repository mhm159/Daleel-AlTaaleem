'use client';

import React, { useState } from 'react';
import { Card, Button } from '../../../components/ui/Button';

const GALLERY = {
  events: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
    'https://images.unsplash.com/photo-1499364865875-0a9c9e7e6a3a?w=600',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600',
  ],
  fieldtrips: [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600',
    'https://images.unsplash.com/photo-1488524368844-b99e3cdc7fce?w=600',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600',
  ],
  competitions: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
  ],
};

const VIDEOS = [
  { title: 'يوم في مدارس دليل التعلم', thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600', duration: '3:45' },
  { title: 'أبرز لقطات معرض العلوم 2025', thumbnail: 'https://images.unsplash.com/photo-1461774894645-34c36943c107?w=600', duration: '5:12' },
  { title: 'بطولة اليوم الرياضي', thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600', duration: '4:30' },
  { title: 'حفل تخرج دفعة 2024', thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', duration: '8:20' },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <>
      <div className="bg-gradient-to-br from-growth-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <span className="badge badge-growth">معرض الوسائط</span>
          <h1 className="mt-4 text-4xl font-bold text-house-800 md:text-5xl">لحظات لا تُنسى</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-house-500">
            توثيق الفرح والإنجازات والذكريات لمجتمعنا المدرسي النابض بالحياة.
          </p>
        </div>
      </div>

      {/* Photos */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {Object.keys(GALLERY).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                  activeTab === key ? 'bg-growth-500 text-white' : 'bg-house-100 text-house-600 hover:bg-house-200'
                }`}
              >
                {key === 'events' ? 'الفعاليات' : key === 'fieldtrips' ? 'الرحلات الميدانية' : 'المسابقات'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY[activeTab].map((img, i) => (
              <div key={i} className="group overflow-hidden rounded-2xl shadow-sm card-hover">
                <img src={img} alt={`${activeTab} ${i+1}`} className="h-48 w-full object-cover transition-transform group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-16 section-sky">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-house-800">فيديوهات مميزة</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VIDEOS.map((v, i) => (
              <Card key={i} className="group overflow-hidden cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-sky-600 transition-transform group-hover:scale-110">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-house-800">{v.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-house-800">هل ترغب في رؤية المزيد؟</h2>
          <p className="mt-3 text-house-500">تابعنا على وسائل التواصل الاجتماعي للحصول على تحديثات يومية ومحتوى حصري.</p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button href="https://instagram.com/learningguideschools" variant="primary">إنستغرام</Button>
            <Button href="/news" variant="secondary">أحدث الأخبار</Button>
          </div>
        </div>
      </section>
    </>
  );
}
