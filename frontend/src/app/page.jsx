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
    <section className="relative overflow-hidden bg-gradient-to-bl from-sky-50 via-white to-growth-50">
      {/* Decorative background */}
      <div className="absolute inset-0 grid-pattern opacity-40"></div>
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-200 blur-3xl opacity-50"></div>
      <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-growth-200 blur-3xl opacity-50"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div className="animate-fade-in-up">
            <Badge variant="gold">✦ التميز في التعليم</Badge>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-house-800 md:text-5xl lg:text-6xl">
              {hp.heroTitle1} <span className="gradient-text">{hp.heroTitleAccent1}</span>،<br />
              {hp.heroTitle2} <span className="gradient-text">{hp.heroTitleAccent2}</span>
            </h1>
            <p className="mt-6 text-lg text-house-500 max-w-xl">
              {hp.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/admissions" className="btn-primary inline-flex items-center justify-center text-center">
                سجّل الآن
                <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/portal" className="btn-secondary inline-flex items-center justify-center text-center">
                بوابة ولي الأمر
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-sky-600">{hp.stat1Value}</div>
                <div className="text-sm text-house-500">{hp.stat1Label}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-growth-600">{hp.stat2Value}</div>
                <div className="text-sm text-house-500">{hp.stat2Label}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-600">{hp.stat3Value}</div>
                <div className="text-sm text-house-500">{hp.stat3Label}</div>
              </div>
            </div>
          </div>

          {/* Logo Visual */}
          <div className="relative animate-fade-in-up flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-3xl bg-gradient-to-br from-sky-400 to-sky-600 p-8 shadow-2xl">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 flex items-center justify-center">
                <img
                  src={settings.images?.heroLogo || "/logo.png"}
                  alt="مدارس دليل التعلم الأهلية"
                  className="object-contain animate-float drop-shadow-2xl w-[240px] h-[240px]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-white">
                <div className="text-sm">
                  <div className="font-semibold">أمان • نمو • تميز</div>
                  <div className="text-sky-100">رسالتنا لطلابنا</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
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
