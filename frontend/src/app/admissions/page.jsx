'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { SectionHeading, Card, Badge, Button, Alert, Loader } from '../../components/ui/Button';
import { GRADE_LEVELS } from '../../types';

const TUITION_FEES = {
  'روضة 1': 12000,
  'روضة 2': 12000,
  'الصف الأول الابتدائي': 15000,
  'الصف الثاني الابتدائي': 15000,
  'الصف الثالث الابتدائي': 15000,
  'الصف الرابع الابتدائي': 17000,
  'الصف الخامس الابتدائي': 17000,
  'الصف السادس الابتدائي': 17000,
  'الصف الأول المتوسط': 19000,
  'الصف الثاني المتوسط': 19000,
  'الصف الثالث المتوسط': 20000,
  'الصف الأول الثانوي': 22000,
  'الصف الثاني الثانوي': 22000,
  'الصف الثالث الثانوي': 24000,
};

const REGISTRATION_FEE = 1500;

function ApplicationForm({ settings }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [admissionNumber, setAdmissionNumber] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    gradeApplyingFor: '', previousSchool: '', previousGrade: '',
    parentName: '', parentEmail: '', parentPhone: '', relationship: 'father',
    address: '', city: '', zipCode: '', country: 'Saudi Arabia',
    source: 'website', additionalInfo: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await api.post('/admissions', formData);
      if (data.success) {
        setSubmitted(true);
        setAdmissionNumber(data.admissionNumber);
      }
    } catch (err) {
      setError(err.message || 'فشل إرسال الطلب، يرجى المحاولة مجدداً');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-growth-100 text-growth-600">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-2xl font-bold text-house-800">تم تقديم الطلب بنجاح!</h3>
        <p className="mt-2 text-house-500">
          شكراً لتقديمك في مدارس دليل التعلم الأهلية. رقم طلبك هو:
        </p>
        <div className="my-4 inline-block rounded-lg bg-sky-50 px-4 py-2 font-mono text-lg font-bold text-sky-600">
          {admissionNumber}
        </div>
        <p className="text-sm text-house-500">
          سيتواصل معكم فريق القبول خلال 3-5 أيام عمل لترتيب موعد المقابلة.
        </p>
        <div className="mt-6">
          <Button href="/portal" variant="primary">تتبع حالة الطلب</Button>
        </div>
      </Card>
    );
  }

  const selectedGradeObj = settings?.grades?.find(g => g.name === formData.gradeApplyingFor);
  const selectedFee = selectedGradeObj ? selectedGradeObj.fee : 0;

  return (
    <Card className="p-6 md:p-8">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${step >= s ? 'bg-sky-500 text-white' : 'bg-house-200 text-house-500'}`}>
              {s}
            </div>
            {s < 3 && <div className={`h-1 flex-1 mx-2 ${step > s ? 'bg-sky-500' : 'bg-house-200'}`}></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} />}

        {/* Step 1: بيانات الطالب */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-house-800">بيانات الطالب</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="input-label">الاسم الأول *</label>
                <input className="input-field" required value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
              </div>
              <div>
                <label className="input-label">اسم العائلة *</label>
                <input className="input-field" required value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
              </div>
              <div>
                <label className="input-label">تاريخ الميلاد *</label>
                <input type="text" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} placeholder="يوم/شهر/سنة" className="input-field" required value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
              </div>
              <div>
                <label className="input-label">الجنس *</label>
                <select className="input-field" required value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
                  <option value="">اختر</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div>
                <label className="input-label">الصف المطلوب الالتحاق به *</label>
                <select className="input-field" required value={formData.gradeApplyingFor} onChange={(e) => updateField('gradeApplyingFor', e.target.value)}>
                  <option value="">اختر الصف</option>
                  {settings?.grades?.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">المدرسة السابقة</label>
                <input className="input-field" value={formData.previousSchool} onChange={(e) => updateField('previousSchool', e.target.value)} />
              </div>
              <div>
                <label className="input-label">الصف السابق</label>
                <input className="input-field" value={formData.previousGrade} onChange={(e) => updateField('previousGrade', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-start">
              <Button type="button" variant="primary" onClick={() => setStep(2)}>التالي</Button>
            </div>
          </div>
        )}

        {/* Step 2: بيانات ولي الأمر */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-house-800">بيانات ولي الأمر</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="input-label">اسم ولي الأمر *</label>
                <input className="input-field" required value={formData.parentName} onChange={(e) => updateField('parentName', e.target.value)} />
              </div>
              <div>
                <label className="input-label">صلة القرابة *</label>
                <select className="input-field" required value={formData.relationship} onChange={(e) => updateField('relationship', e.target.value)}>
                  <option value="father">الأب</option>
                  <option value="mother">الأم</option>
                  <option value="guardian">ولي أمر</option>
                </select>
              </div>
              <div>
                <label className="input-label">البريد الإلكتروني *</label>
                <input type="email" className="input-field" required value={formData.parentEmail} onChange={(e) => updateField('parentEmail', e.target.value)} />
              </div>
              <div>
                <label className="input-label">رقم الجوال *</label>
                <input className="input-field" required placeholder="05xxxxxxxx" value={formData.parentPhone} onChange={(e) => updateField('parentPhone', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">العنوان *</label>
                <input className="input-field" required value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
              </div>
              <div>
                <label className="input-label">المدينة *</label>
                <input className="input-field" required value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div>
                <label className="input-label">الرمز البريدي</label>
                <input className="input-field" value={formData.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} />
              </div>
              <div>
                <label className="input-label">كيف عرفت عن المدرسة؟</label>
                <select className="input-field" value={formData.source} onChange={(e) => updateField('source', e.target.value)}>
                  <option value="website">الموقع الإلكتروني</option>
                  <option value="referral">توصية من معارف</option>
                  <option value="social_media">وسائل التواصل الاجتماعي</option>
                  <option value="walk_in">زيارة مباشرة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">معلومات إضافية</label>
                <textarea className="input-field" rows="3" value={formData.additionalInfo} onChange={(e) => updateField('additionalInfo', e.target.value)}></textarea>
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>السابق</Button>
              <Button type="button" variant="primary" onClick={() => setStep(3)}>التالي</Button>
            </div>
          </div>
        )}

        {/* Step 3: مراجعة وإرسال */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-house-800">مراجعة وإرسال الطلب</h3>
            <div className="rounded-lg bg-sky-50 p-4">
              <h4 className="font-semibold text-house-800">ملخص الطلب</h4>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-house-500">الطالب:</dt><dd className="font-medium">{formData.firstName} {formData.lastName}</dd></div>
                <div className="flex justify-between"><dt className="text-house-500">الصف:</dt><dd className="font-medium">{formData.gradeApplyingFor}</dd></div>
                <div className="flex justify-between"><dt className="text-house-500">ولي الأمر:</dt><dd className="font-medium">{formData.parentName}</dd></div>
                <div className="flex justify-between"><dt className="text-house-500">البريد الإلكتروني:</dt><dd className="font-medium">{formData.parentEmail}</dd></div>
                <div className="flex justify-between"><dt className="text-house-500">الرسوم السنوية:</dt><dd className="font-bold text-sky-600">{selectedFee.toLocaleString('ar-SA')} ريال</dd></div>
              </dl>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(2)}>السابق</Button>
              <Button type="submit" variant="gold" disabled={submitting}>
                {submitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}

function TuitionSection({ settings }) {
  return (
    <section className="py-20 section-gold">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="هيكل الرسوم الدراسية" subtitle="رسوم شفافة وتنافسية مقابل تعليم متميز" accent="gold" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settings?.grades?.map((grade) => (
            <Card key={grade.id} className="p-6">
              <h3 className="mb-2 font-bold text-house-800">{grade.name}</h3>
              <div className="text-3xl font-bold text-gold-600">{Number(grade.fee).toLocaleString('ar-SA')} ريال</div>
              <div className="mt-1 text-sm text-house-500">سنوياً</div>
            </Card>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-house-600">
            <strong className="text-gold-600">رسوم التسجيل:</strong> {Number(settings?.registrationFee || 1500).toLocaleString('ar-SA')} ريال (تُدفع مرة واحدة عند القبول)
          </p>
          <p className="mt-2 text-sm text-house-500">
            * تشمل الرسوم الكتب المدرسية ومواد المختبرات والأنشطة اللاصفية الأساسية.
            رسوم المواصلات والزي المدرسي منفصلة.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { n: 1, title: 'تقديم الطلب', desc: 'أكمل نموذج التقديم الإلكتروني ببيانات الطالب وولي الأمر.' },
    { n: 2, title: 'مراجعة الوثائق', desc: 'يراجع فريق القبول طلبك وسجلاتك الأكاديمية السابقة.' },
    { n: 3, title: 'المقابلة والتقييم', desc: 'ترتيب زيارة للحرم المدرسي وإجراء اختبار تحديد المستوى.' },
    { n: 4, title: 'القبول والتسجيل', desc: 'استلام رسالة القبول وسداد رسوم التسجيل وإتمام الإجراءات.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="خطوات القبول والتسجيل" subtitle="خطوات واضحة وبسيطة للانضمام إلى عائلة دليل التعلم" accent="sky" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-xl font-bold text-white shadow-lg">
                {s.n}
              </div>
              <h3 className="mt-4 font-bold text-house-800">{s.title}</h3>
              <p className="mt-2 text-sm text-house-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdmissionCriteria() {
  const criteria = [
    'مفتوح أمام جميع الجنسيات والخلفيات',
    'اشتراطات العمر لكل مرحلة (الروضة: 4-5 سنوات)',
    'السجلات الأكاديمية السابقة للصف الأول فأعلى',
    'نموذج الفحص الطبي المكتمل',
    'مقابلة مع أولياء الأمور',
    'اختبار تحديد المستوى للصف الثالث فأعلى',
  ];

  return (
    <section className="py-20 section-sky">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="شروط القبول" subtitle="ما الذي نبحث عنه في طلابنا" accent="growth" />
        <div className="mx-auto max-w-3xl">
          <Card className="p-8">
            <ul className="space-y-3">
              {criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="mt-0.5 flex-shrink-0 text-growth-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-house-600">{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function AdmissionsPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
      })
      .catch(console.error);
  }, []);

  if (!settings) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <>
      <div className="bg-gradient-to-br from-sky-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Badge variant="sky">القبول والتسجيل</Badge>
          <h1 className="mt-4 text-4xl font-bold text-house-800 md:text-5xl">انضم إلى عائلة دليل التعلم</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-house-500">
            ابدأ رحلة ابنك نحو التميز. سجّل إلكترونياً في دقائق.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <SectionHeading title="نموذج التقديم الإلكتروني" subtitle="أكمل جميع الحقول لإرسال طلبك" accent="sky" />
          <ApplicationForm settings={settings} />
        </div>
      </section>

      <ProcessSection />
      <AdmissionCriteria />
      <TuitionSection settings={settings} />
    </>
  );
}
