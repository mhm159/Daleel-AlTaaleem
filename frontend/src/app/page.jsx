'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../lib/api';
import { Button, Card, SectionHeading, Badge } from '../components/ui/Button';
import { Loader, Alert } from '../components/ui/Button';

function HeroSection({ settings }) {
  if (!settings) return <div className="h-96 flex items-center justify-center"><Loader /></div>;
  const hp = settings.homepage || {};

  return (
    <section className="relative overflow-hidden bg-[#e8f6f0] min-h-[90vh] flex items-center pt-20 pb-16 lg:pt-28">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-[#c2ecd8] rounded-tr-[400px] rounded-br-[100px] -translate-x-1/4 translate-y-1/4 opacity-70"></div>
      
      {/* Grid pattern subtle overlay on the background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Text content */}
          <div className="animate-fade-in-up z-10 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-white/50 mb-6">
              <span className="text-growth-600 text-lg">✨</span>
              <span className="text-sm font-semibold text-house-700">تعليم ذكي، مستقبل مشرق</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-[1.1] text-[#1c2e26] md:text-6xl lg:text-7xl mb-6">
              {hp.heroTitle1 || 'مستقبل التعليم،'}<br />
              {hp.heroTitle2 || 'مدعوم بـ'} <span className="text-gold-500 relative inline-block">
                {hp.heroTitleAccent2 || 'الذكاء'}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-gold-400/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q 50 0 100 15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg>
              </span>
            </h1>
            
            <p className="text-lg text-house-600 max-w-lg mb-10 leading-relaxed font-medium">
              {hp.heroSubtitle || "منصة واحدة لتوحيد رحلتك التعليمية، من الاختبارات التفاعلية إلى الجلسات المباشرة بقيادة الخبراء، كل ذلك في مكان واحد."}
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row items-center">
              <Link href="/admissions" className="px-8 py-3.5 rounded-full bg-[#0d4a38] text-white font-bold hover:bg-[#083125] transition-all shadow-lg shadow-[#0d4a38]/30 w-full sm:w-auto text-center transform hover:-translate-y-1">
                ابدأ الآن
              </Link>
              <Link href="/portal" className="px-8 py-3.5 rounded-full border-2 border-[#0d4a38] text-[#0d4a38] font-bold hover:bg-[#0d4a38] hover:text-white transition-all w-full sm:w-auto text-center transform hover:-translate-y-1">
                اكتشف المزيد
              </Link>
            </div>
          </div>

          {/* Visual Component */}
          <div className="relative animate-fade-in-up flex items-center justify-center mt-12 lg:mt-0" style={{ animationDelay: '0.2s' }}>
            {/* The Circle Background */}
            <div className="absolute w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full border-[8px] border-gold-400 bg-[#22c55e] overflow-hidden shadow-2xl">
              {/* Grid inside circle */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff44_2px,transparent_2px),linear-gradient(to_bottom,#ffffff44_2px,transparent_2px)] bg-[size:40px_40px]"></div>
              
              {/* Decorative squares */}
              <div className="absolute top-12 left-12 w-6 h-6 bg-white/30 rounded-sm rotate-12"></div>
              <div className="absolute top-32 right-16 w-8 h-8 bg-white/30 rounded-sm -rotate-6"></div>
              <div className="absolute bottom-24 left-1/3 w-5 h-5 bg-white/30 rounded-sm rotate-45"></div>
            </div>

            {/* The Image (popping out) */}
            <div className="relative z-10 w-[280px] md:w-[380px] h-[350px] md:h-[480px] flex items-end justify-center">
              <img
                src={settings.images?.heroLogo || "/logo.png"}
                alt="Student Hero"
                className="w-full h-full object-contain object-bottom drop-shadow-2xl"
              />
            </div>

            {/* Floating Card 1: 300+ Courses */}
            <div className="absolute top-1/4 -left-6 md:-left-12 bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              </div>
              <div>
                <div className="text-lg md:text-xl font-extrabold text-house-800">300+</div>
                <div className="text-xs md:text-sm text-house-500 font-medium">دورات ومناهج</div>
              </div>
            </div>

            {/* Floating Card 2: 30+ Trainers */}
            <div className="absolute top-4 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <div className="text-lg md:text-xl font-extrabold text-house-800">30+</div>
                <div className="text-xs md:text-sm text-house-500 font-medium">معلم وخبير</div>
              </div>
            </div>

            {/* Floating Card 3: 1K Learners */}
            <div className="absolute bottom-24 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0.9s' }}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div className="text-lg md:text-xl font-extrabold text-house-800">1K+</div>
                <div className="text-xs md:text-sm text-house-500 font-medium">طالب مسجل</div>
              </div>
            </div>

            {/* Floating Avatars */}
            <div className="absolute bottom-6 right-0 md:-right-4 bg-white rounded-full shadow-xl py-2 px-4 flex items-center gap-3 animate-float" style={{ animationDelay: '1.2s' }}>
              <div className="flex -space-x-3 rtl:space-x-reverse">
                <img className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" src="https://i.pravatar.cc/100?img=1" alt="Student" />
                <img className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" src="https://i.pravatar.cc/100?img=2" alt="Student" />
                <img className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" src="https://i.pravatar.cc/100?img=3" alt="Student" />
              </div>
              <div className="text-sm font-extrabold text-house-800 flex items-center gap-1">
                <span className="text-green-500">❤️</span> 23k+
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'بيئة آمنة ومحمية',
      desc: 'حرم مدرسي مؤمَّن على مدار اليوم بكاميرات المراقبة وطاقم متخصص، يجعل أبناءكم في أمان تام.',
      color: 'sky',
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
      title: 'تميز أكاديمي',
      desc: 'مناهج وطنية سعودية معتمدة مع أساليب تدريسية حديثة تُراعي الفروق الفردية وتُحفز التفوق.',
      color: 'growth',
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
      title: 'نمو شامل ومتكامل',
      desc: 'أنشطة رياضية وفنية وثقافية وقيادية تُكمل الجانب الأكاديمي لبناء شخصية متوازنة.',
      color: 'gold',
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      title: 'شراكة مع الأسرة',
      desc: 'تواصل شفاف ومستمر مع أولياء الأمور عبر بوابة إلكترونية متكاملة تُبقيهم على اطلاع دائم.',
      color: 'sky',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="لماذا تختار مدارس دليل التعلم؟"
          subtitle="نجمع بين الأمان والتميز الأكاديمي وتنمية الشخصية لنقدم تعليماً استثنائياً"
          accent="sky"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                f.color === 'sky' ? 'bg-sky-100 text-sky-600' :
                f.color === 'growth' ? 'bg-growth-100 text-growth-600' :
                'bg-gold-100 text-gold-600'
              }`}>
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-house-800">{f.title}</h3>
              <p className="text-sm text-house-500">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickAccessSection() {
  const items = [
    {
      title: 'التسجيل الإلكتروني',
      desc: 'سجّل ابنك أو ابنتك بخطوات بسيطة عبر نموذج التقديم الإلكتروني',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      href: '/admissions',
      color: 'sky',
    },
    {
      title: 'بوابة ولي الأمر',
      desc: 'تابع درجات طفلك وحضوره وتواصل مع المعلمين بكل سهولة',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>,
      href: '/portal',
      color: 'growth',
    },
    {
      title: 'سداد الرسوم',
      desc: 'سداد الرسوم الدراسية إلكترونياً بأمان وسهولة في أي وقت',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
      href: '/admissions#payment',
      color: 'gold',
    },
    {
      title: 'الأخبار والفعاليات',
      desc: 'ابقَ على اطلاع بآخر أخبار المدرسة وفعالياتها الدورية',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1"/></svg>,
      href: '/news',
      color: 'sky',
    },
  ];

  return (
    <section className="py-20 section-sky">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="خدمات إلكترونية سريعة"
          subtitle="كل ما تحتاجه في متناول يدك بضغطة واحدة"
          accent="growth"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="group h-full p-6 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${
                  item.color === 'sky' ? 'bg-sky-100 text-sky-600' :
                  item.color === 'growth' ? 'bg-growth-100 text-growth-600' :
                  'bg-gold-100 text-gold-600'
                }`}>
                  {item.icon}
                </div>
                <h3 className="mb-2 font-bold text-house-800">{item.title}</h3>
                <p className="text-sm text-house-500">{item.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/news?limit=3')
      .then(data => setNews(data.news || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="آخر الأخبار والفعاليات"
          subtitle="ابقَ على اطلاع بأحدث أخبار مدرستنا وفعالياتها"
          accent="gold"
        />
        {loading && <Loader />}
        {error && <Alert type="error" message={error} />}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`}>
                <Card className="group h-full overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-sky-100">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sky-300">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <Badge variant={item.category === 'achievement' ? 'gold' : 'sky'}>{item.category}</Badge>
                    <h3 className="mt-3 line-clamp-2 font-bold text-house-800 group-hover:text-sky-600">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-house-500">{item.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                      اقرأ المزيد
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
            {news.length === 0 && (
              <div className="col-span-3 text-center text-house-400 py-12">لا توجد أخبار حالياً</div>
            )}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link href="/news" className="btn-secondary">عرض كل الأخبار</Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-l from-sky-600 to-sky-700 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="text-3xl font-bold md:text-4xl">هل أنت مستعد لتسجيل ابنك معنا؟</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-100">
          انضم إلى عائلة مدارس دليل التعلم الأهلية. التسجيل للعام الدراسي القادم مفتوح الآن.
          امنح طفلك بيئة تعليمية آمنة ومتميزة.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/admissions" className="btn-gold">ابدأ التسجيل الآن</Link>
          <Link href="/contact" className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-sky-600">تواصل معنا</Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <HeroSection settings={settings} />
      <FeaturesSection />
      <QuickAccessSection />
      <NewsFeed />
      <CTASection />
    </>
  );
}
