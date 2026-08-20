'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading, Card, Badge } from '../../components/ui/Button';

function PrincipalMessage() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500"
              alt="مدير المدرسة"
              className="mx-auto rounded-3xl shadow-xl"
            />
          </div>
          <div>
            <Badge variant="gold">كلمة المدير</Badge>
            <h2 className="mt-4 text-3xl font-bold text-house-800 md:text-4xl">
              رسالة من مؤسس المدرسة
            </h2>
            <div className="mt-6 space-y-4 text-house-600">
              <p>
                "أهلاً بكم في مدارس دليل التعلم الأهلية. منذ أكثر من عقد ونصف، ونحن نحمل رسالة واضحة:
                توفير بيئة تعليمية آمنة تُنمّي قدرات الطالب وتبني شخصيته وفق القيم الإسلامية
                والهوية السعودية الأصيلة."
              </p>
              <p>
                "لا نعلّم المواد الدراسية فحسب، بل نزرع الثقة والفضول والشخصية المستقلة.
                معلمونا المتميزون ومرافقنا الحديثة وبرامجنا المتنوعة تعمل معاً لضمان
                أن يخرج طالبنا مستعداً لمواجهة تحديات العصر."
              </p>
              <p>
                "لأولياء الأمور: أنتم شركاؤنا الحقيقيون في هذه الرحلة. من خلال بوابتنا الإلكترونية
                وقنوات التواصل المفتوحة، نحرص على أن تكونوا على اطلاع دائم بمسيرة أبنائكم.
                معاً نبني أجيالاً تفخر بها المملكة."
              </p>
            </div>
            <div className="mt-6">
              <div className="font-bold text-house-800">د. سعد بن محمد العمري</div>
              <div className="text-sm text-house-500">المؤسس والمدير العام، مدارس دليل التعلم الأهلية</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HistorySection() {
  const milestones = [
    { year: '2010', title: 'التأسيس', desc: 'تأسست مدارس دليل التعلم الأهلية بـ 50 طالباً ورؤية نحو تعليم راقٍ ونوعي.' },
    { year: '2014', title: 'أول دفعة خريجين', desc: 'احتفلنا بأول دفعة خريجين حققت نسبة 98% في القبول الجامعي.' },
    { year: '2018', title: 'توسعة الحرم المدرسي', desc: 'افتتحنا مختبرات العلوم والمكتبة والمرافق الرياضية خدمةً لأكثر من 1500 طالب.' },
    { year: '2021', title: 'التحول الرقمي', desc: 'أطلقنا بوابة ولي الأمر ومنصة التعلم الإلكترونية لمواكبة متطلبات العصر.' },
    { year: '2023', title: 'الاعتماد الأكاديمي', desc: 'نلنا شهادة الاعتماد الأكاديمي تقديراً لمعايير التميز والجودة والسلامة.' },
    { year: '2025', title: 'المدارس الذكية', desc: 'إطلاق برامج الذكاء الاصطناعي والفصول الذكية التفاعلية في جميع المراحل.' },
  ];

  return (
    <section className="py-20 section-growth">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="مسيرتنا عبر السنين"
          subtitle="أكثر من عقد من النمو والتميز وخدمة المجتمع"
          accent="growth"
        />
        <div className="relative">
          <div className="absolute right-4 top-0 h-full w-0.5 bg-growth-200 md:right-1/2"></div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="mr-12 flex-1 md:mr-0 md:w-1/2 md:px-8">
                  <Card className="p-6">
                    <div className="mb-2 text-2xl font-bold text-growth-600">{m.year}</div>
                    <h3 className="mb-2 font-bold text-house-800">{m.title}</h3>
                    <p className="text-sm text-house-500">{m.desc}</p>
                  </Card>
                </div>
                <div className="absolute right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-growth-500 text-white shadow-lg md:right-1/2 md:-translate-x-1/2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    { icon: '🛡️', title: 'الأمان أولاً', desc: 'كل طالب يستحق أن يشعر بالأمان والانتماء في بيئة مدرسية دافئة.' },
    { icon: '🌱', title: 'عقلية النمو', desc: 'نؤمن بالقدرة اللامحدودة لكل متعلم وندعمها بالتشجيع المستمر.' },
    { icon: '⭐', title: 'السعي للتميز', desc: 'نسعى لأعلى المعايير في كل ما نقدمه تعليماً وتربيةً وبناءً للشخصية.' },
    { icon: '🤝', title: 'الشراكة مع الأسرة', desc: 'أولياء الأمور والمدرسة فريق واحد متكامل لتحقيق نجاح الطالب.' },
    { icon: '💡', title: 'الابتكار والإبداع', desc: 'نتبنى أحدث الأساليب والتقنيات لتحسين مخرجات التعليم.' },
    { icon: '❤️', title: 'القيم الإسلامية', desc: 'نُرسّخ مبادئ الإسلام والهوية الوطنية السعودية في كل طالب.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="قيمنا الأساسية" subtitle="المبادئ التي تُوجّه كل ما نقوم به" accent="sky" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Card key={v.title} className="p-6 text-center">
              <div className="mb-3 text-4xl">{v.icon}</div>
              <h3 className="mb-2 font-bold text-house-800">{v.title}</h3>
              <p className="text-sm text-house-500">{v.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FacilitiesSection() {
  const facilities = [
    { name: 'مختبرات العلوم والتقنية', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500', desc: 'مختبرات متكاملة للفيزياء والكيمياء والأحياء والروبوتيات.' },
    { name: 'المكتبة ومركز المصادر', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500', desc: 'مكتبة ضخمة تحتوي على آلاف المراجع الورقية والرقمية.' },
    { name: 'الملاعب والصالات الرياضية', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', desc: 'مرافق رياضية متكاملة لكرة القدم والسلة والسباحة وغيرها.' },
    { name: 'قاعات الفنون والموسيقى', img: 'https://images.unsplash.com/photo-1503454537194-598f118e6198?w=500', desc: 'استوديوهات للرسم والنحت والفنون والأنشطة الموسيقية.' },
    { name: 'الفصول الذكية', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aae7c2?w=500', desc: 'فصول دراسية تفاعلية مزودة بأحدث التقنيات التعليمية.' },
    { name: 'ساحات اللعب الآمنة', img: 'https://images.unsplash.com/photo-1564429097439-e1d2e7c8e6b3?w=500', desc: 'ملاعب مخصصة لكل مرحلة عمرية بإشراف متواصل.' },
  ];

  return (
    <section className="py-20 section-sky">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="مرافق الحرم المدرسي" subtitle="مرافق عالمية المستوى مصممة للتعلم والنمو" accent="gold" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <Card key={f.name} className="group overflow-hidden">
              <div className="aspect-video overflow-hidden bg-sky-100">
                <img src={f.img} alt={f.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-bold text-house-800">{f.name}</h3>
                <p className="text-sm text-house-500">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementsSection() {
  const achievements = [
    { value: '98%', label: 'نسبة القبول الجامعي' },
    { value: '+15', label: 'سنة من التميز' },
    { value: '+50', label: 'جائزة وطنية' },
    { value: '100%', label: 'سجل سلامة نظيف' },
  ];

  return (
    <section className="py-20 bg-house-900 text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="إنجازاتنا" subtitle="أرقام تعكس التزامنا بالتميز والجودة" accent="gold" />
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {achievements.map((a) => (
            <div key={a.label} className="text-center">
              <div className="text-4xl font-bold text-gold-400 md:text-5xl">{a.value}</div>
              <div className="mt-2 text-sm text-house-300">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-sky-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Badge variant="sky">عن المدرسة</Badge>
          <h1 className="mt-4 text-4xl font-bold text-house-800 md:text-5xl">نرعى التميز منذ عام 2010</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-house-500">
            بيت آمن للعقول النامية — تعرّف على قصتنا وقيمنا والمجتمع الذي بنيناه معاً.
          </p>
        </div>
      </div>
      <PrincipalMessage />
      <HistorySection />
      <ValuesSection />
      <FacilitiesSection />
      <AchievementsSection />
    </>
  );
}
