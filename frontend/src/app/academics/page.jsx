'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { SectionHeading, Card, Badge, Loader, Alert } from '../../components/ui/Button';

const GRADES = [
  {
    level: 'رياض الأطفال',
    grades: ['روضة 1', 'روضة 2'],
    age: 'الأعمار 4-5 سنوات',
    color: 'gold',
    desc: 'تعليم قائم على اللعب يبني المهارات الأساسية والنمو الاجتماعي وحب الاكتشاف.',
    subjects: ['اللغة العربية والقراءة', 'الأرقام والمنطق', 'الفنون والحرف', 'التربية البدنية', 'المهارات الاجتماعية', 'التربية الإسلامية'],
  },
  {
    level: 'المرحلة الابتدائية',
    grades: ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    age: 'الأعمار 6-11 سنة',
    color: 'sky',
    desc: 'بناء الأسس الأكاديمية المتينة مع تعزيز الفضول والإبداع وبناء الشخصية.',
    subjects: ['اللغة العربية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'اللغة الإنجليزية', 'التربية الإسلامية', 'الفنون', 'التربية البدنية', 'الحاسب الآلي'],
  },
  {
    level: 'المرحلة المتوسطة',
    grades: ['الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'],
    age: 'الأعمار 12-14 سنة',
    color: 'growth',
    desc: 'تنمية التفكير النقدي والاستقلالية والتخصص الأعمق في المواد الدراسية.',
    subjects: ['اللغة العربية', 'الرياضيات', 'الأحياء', 'الفيزياء', 'الكيمياء', 'التاريخ', 'الجغرافيا', 'اللغة الإنجليزية', 'التربية الإسلامية', 'الحاسب الآلي', 'التربية البدنية'],
  },
  {
    level: 'المرحلة الثانوية',
    grades: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
    age: 'الأعمار 15-17 سنة',
    color: 'gold',
    desc: 'مناهج تحضيرية للجامعة تُعد الطلاب لمتطلبات التعليم العالي ومتطلبات سوق العمل.',
    subjects: ['اللغة العربية المتقدمة', 'الرياضيات المتقدمة', 'الأحياء', 'الكيمياء', 'الفيزياء', 'الاقتصاد', 'اللغة الإنجليزية', 'التربية الإسلامية', 'الحاسب الآلي', 'التحضير للقدرات'],
  },
];

function CurriculumSection() {
  const phils = [
    { icon: '🎯', title: 'محوره الطالب', desc: 'كل طالب يتعلم بطريقة مختلفة؛ نُكيّف أساليب التدريس لتناسب الاحتياجات الفردية.' },
    { icon: '🌍', title: 'منظور عالمي', desc: 'معايير دولية للمناهج مع الحفاظ على القيم الثقافية والهوية السعودية الأصيلة.' },
    { icon: '💻', title: 'دمج التكنولوجيا', desc: 'فصول ذكية وأدوات رقمية ومهارات القرن الواحد والعشرين في صميم المنهج.' },
    { icon: '❤️', title: 'التربية على القيم', desc: 'بناء الأخلاق والصمود والقيادة والتعاطف جنباً إلى جنب مع التحصيل الأكاديمي.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="فلسفتنا التعليمية" subtitle="كيف نُنشئ متعلمين مدى الحياة" accent="sky" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {phils.map((p) => (
            <Card key={p.title} className="p-6 text-center">
              <div className="mb-3 text-4xl">{p.icon}</div>
              <h3 className="mb-2 font-bold text-house-800">{p.title}</h3>
              <p className="text-sm text-house-500">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function GradeLevelsSection() {
  return (
    <section className="py-20 section-sky">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="المراحل الدراسية" subtitle="رحلة تعليمية متصلة من الروضة حتى الثانوية" accent="growth" />
        <div className="space-y-8">
          {GRADES.map((g) => (
            <Card key={g.level} className="overflow-hidden">
              <div className={`flex items-center justify-between bg-${g.color}-50 px-6 py-4 border-b border-${g.color}-100`}>
                <div>
                  <h3 className="text-xl font-bold text-house-800">{g.level}</h3>
                  <span className="text-sm text-house-500">{g.age}</span>
                </div>
                <Badge variant={g.color}>{g.grades.length} صفوف</Badge>
              </div>
              <div className="p-6">
                <p className="mb-4 text-house-600">{g.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {g.grades.map(grade => (
                    <span key={grade} className={`rounded-full bg-${g.color}-100 px-3 py-1 text-sm font-medium text-${g.color}-700`}>{grade}</span>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold text-house-700">المواد الأساسية:</h4>
                  <div className="flex flex-wrap gap-2">
                    {g.subjects.map(s => (
                      <span key={s} className="rounded-md bg-house-100 px-2 py-1 text-xs text-house-600">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScheduleSection() {
  const schedules = [
    { time: '07:00 - 07:30', activity: 'الحضور وطابور الصباح', color: 'sky' },
    { time: '07:30 - 09:00', activity: 'الحصة الأولى (اللغة العربية / الرياضيات)', color: 'growth' },
    { time: '09:00 - 09:15', activity: 'الاستراحة الأولى', color: 'gold' },
    { time: '09:15 - 10:45', activity: 'الحصة الثانية (العلوم / اللغة الإنجليزية)', color: 'sky' },
    { time: '10:45 - 11:30', activity: 'استراحة الغداء وصلاة الظهر', color: 'gold' },
    { time: '11:30 - 13:00', activity: 'الحصص الاختيارية والأنشطة (فنون / رياضة / حاسب)', color: 'growth' },
    { time: '13:00 - 13:30', activity: 'مراجعة ختامية وانصراف', color: 'sky' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <SectionHeading title="الجدول اليومي" subtitle="يوم دراسي متوازن يجمع التعلم واللعب والنمو" accent="gold" />
        <Card className="p-6">
          <div className="space-y-3">
            {schedules.map((s, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-house-100 p-3">
                <div className={`flex h-12 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-${s.color}-100 text-sm font-bold text-${s.color}-700`}>
                  {s.time}
                </div>
                <div className="text-house-700">{s.activity}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/calendar?limit=50')
      .then(data => setEvents(data.events || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const typeLabels = {
    term: 'الفصل الدراسي',
    exam: 'اختبارات',
    holiday: 'إجازة',
    break: 'استراحة',
    event: 'فعالية',
    deadline: 'موعد نهائي',
    parent_meeting: 'لقاء أولياء أمور',
  };

  const getTypeColor = (type) => {
    const colors = {
      term: 'bg-sky-100 text-sky-700',
      exam: 'bg-red-100 text-red-700',
      holiday: 'bg-growth-100 text-growth-700',
      break: 'bg-gold-100 text-gold-700',
      event: 'bg-purple-100 text-purple-700',
      deadline: 'bg-orange-100 text-orange-700',
      parent_meeting: 'bg-sky-100 text-sky-700',
    };
    return colors[type] || 'bg-house-100 text-house-700';
  };

  return (
    <section className="py-20 section-growth">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <SectionHeading title="التقويم الدراسي" subtitle="التواريخ الرئيسية للعام الدراسي الحالي" accent="growth" />
        {loading && <Loader />}
        {error && <Alert type="error" message={error} />}
        {!loading && !error && (
          <div className="space-y-3">
            {events.length === 0 && (
              <Card className="p-6 text-center text-house-400">لا توجد فعاليات مجدولة حالياً</Card>
            )}
            {events.map((e) => (
              <Card key={e.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
                    <span className="text-xs font-bold text-house-400">
                      {new Date(e.startDate).toLocaleDateString('ar-SA', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-house-800">
                      {new Date(e.startDate).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-house-800">{e.title}</h4>
                    {e.description && <p className="text-sm text-house-500">{e.description}</p>}
                  </div>
                </div>
                <span className={`badge ${getTypeColor(e.type)}`}>{typeLabels[e.type] || e.type}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function AcademicsPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-sky-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Badge variant="sky">الأنشطة الأكاديمية</Badge>
          <h1 className="mt-4 text-4xl font-bold text-house-800 md:text-5xl">مناهج تُعدّ للمستقبل</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-house-500">
            مناهج وطنية معتمدة ومتكاملة — تعليم يُعد الطالب لعالم متغير.
          </p>
        </div>
      </div>
      <CurriculumSection />
      <GradeLevelsSection />
      <ScheduleSection />
      <CalendarSection />
    </>
  );
}
