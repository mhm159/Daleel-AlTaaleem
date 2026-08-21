'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SectionHeading, Card, Badge, Button, Loader, Alert } from '../../components/ui/Button';
import { api } from '../../lib/api';

export default function QiyasPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registration Form states
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', grade: '' });
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tracking Form states
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setSubmitted(false);
    setFormData({ name: '', phone: '', grade: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const code = 'QYS-' + Math.floor(1000 + Math.random() * 9000);
      const res = await fetch('/api/qiyas_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          grade: formData.grade,
          courseid: selectedCourse.id,
          coursename: selectedCourse.name,
          code: code,
          status: 'جديد',
          createdat: new Date().toISOString()
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'حدث خطأ');
      
      setTrackingCode(code);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackInput) return;
    setTracking(true);
    setTrackError('');
    setTrackResult(null);
    try {
      // Find request by code
      const res = await fetch('/api/qiyas_requests?code=' + trackInput.trim().toUpperCase());
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'لم يتم العثور على الطلب');
      
      const request = data;
      
      if (!request) throw new Error('لم يتم العثور على الطلب');
      setTrackResult(request);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTracking(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  const courses = settings?.qiyas || [
    { id: '1', name: 'دورة تأسيس القدرات (كمي ولفظي)', price: 450, duration: '4 أسابيع' },
    { id: '2', name: 'دورة التحصيلي المكثفة', price: 550, duration: '6 أسابيع' }
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 py-20 relative overflow-hidden text-white">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8 relative z-10">
          <Badge variant="gold">مستقبلك يبدأ من هنا</Badge>
          <h1 className="mt-6 text-4xl font-bold md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
            أكاديمية القدرات والتحصيلي
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
            برامج تدريبية متطورة لتأهيل الطلاب لاجتياز اختبارات القياس بتفوق، بإشراف نخبة من المدربين المعتمدين بأساليب ذكية وعملية.
          </p>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="text-white border-white hover:bg-white/10 flex items-center gap-2" onClick={() => setShowTrackModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              متابعة تسجيلي
            </Button>
          </div>
        </div>
      </div>

      <section className="py-20 bg-house-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading title="البرامج التدريبية المتاحة" subtitle="اختر الدورة المناسبة لطموحك الأكاديمي" accent="sky" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Card 1 */}
            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
              <div className="relative h-64 overflow-hidden bg-indigo-900">
                <img src={settings?.images?.qiyasAd || "/qiyas_ad.jpg"} alt="إعلان دورة القدرات" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="gold" className="mb-2">القدرات العامة</Badge>
                  <h3 className="text-2xl font-bold text-white">{courses[0]?.name || 'دورة تأسيس القدرات (كمي ولفظي)'}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="block text-sm text-house-500">استثمارك في مستقبلك</span>
                    <span className="text-3xl font-bold text-indigo-600">{courses[0]?.price || 450} <span className="text-sm font-normal">ريال</span></span>
                  </div>
                  <div className="text-left">
                    <span className="block text-sm text-house-500">مدة الدورة</span>
                    <span className="font-semibold text-house-800">{courses[0]?.duration || '4 أسابيع'}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-8 text-sm text-house-600">
                  <li className="flex items-center gap-2"><svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> استراتيجيات الحل السريع</li>
                  <li className="flex items-center gap-2"><svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> اختبارات تجريبية محاكية لقياس</li>
                  <li className="flex items-center gap-2"><svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> مذكرات وتجميعات حصرية</li>
                </ul>
                <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => handleApply(courses[0])}>
                  سجل الآن
                </Button>
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
              <div className="relative h-64 overflow-hidden bg-purple-900">
                <img src={settings?.images?.tahsiliAd || "/tahsili_ad.jpg"} alt="إعلان دورة التحصيلي" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="sky" className="mb-2">التحصيلي العلمي</Badge>
                  <h3 className="text-2xl font-bold text-white">{courses[1]?.name || 'دورة التحصيلي المكثفة'}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="block text-sm text-house-500">استثمارك في مستقبلك</span>
                    <span className="text-3xl font-bold text-purple-600">{courses[1]?.price || 550} <span className="text-sm font-normal">ريال</span></span>
                  </div>
                  <div className="text-left">
                    <span className="block text-sm text-house-500">مدة الدورة</span>
                    <span className="font-semibold text-house-800">{courses[1]?.duration || '6 أسابيع'}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-8 text-sm text-house-600">
                  <li className="flex items-center gap-2"><svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> مراجعة شاملة لجميع المواد العلمية</li>
                  <li className="flex items-center gap-2"><svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> تركيز على المفاهيم والأساسيات</li>
                  <li className="flex items-center gap-2"><svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> حل تجميعات السنوات السابقة</li>
                </ul>
                <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-500/30" onClick={() => handleApply(courses[1])}>
                  سجل الآن
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl scale-in">
            {submitted ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-house-800">تم التسجيل بنجاح!</h3>
                <p className="mt-2 text-house-500">تم حجز مقعدك المبدئي بنجاح.</p>
                <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-100">
                  <p className="text-sm text-sky-800 font-medium mb-1">كود المتابعة الخاص بك هو:</p>
                  <p className="text-3xl font-bold text-sky-600 tracking-wider font-mono">{trackingCode}</p>
                  <p className="text-xs text-sky-600 mt-2">يرجى الاحتفاظ بهذا الكود لتتمكن من متابعة حالة طلبك لاحقاً</p>
                </div>
                <Button className="mt-6 w-full" onClick={() => setShowModal(false)}>إغلاق</Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-house-800">تسجيل في الدورة</h3>
                  <button onClick={() => setShowModal(false)} className="text-house-400 hover:text-house-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="mb-6 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <span className="block text-sm text-indigo-600 font-semibold">{selectedCourse?.name}</span>
                  <span className="block text-xl font-bold text-indigo-900 mt-1">{selectedCourse?.price} ريال</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="input-label">اسم الطالب رباعي</label>
                    <input required className="input-field" placeholder="أدخل الاسم الكامل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">رقم الجوال (للتواصل واتساب)</label>
                    <input required type="tel" className="input-field" placeholder="05xxxxxxxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">الصف الدراسي الحالي</label>
                    <select required className="input-field" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                      <option value="">اختر الصف</option>
                      <option value="ثاني ثانوي">ثاني ثانوي</option>
                      <option value="ثالث ثانوي">ثالث ثانوي</option>
                      <option value="خريج">خريج</option>
                    </select>
                  </div>
                  <Button type="submit" variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4" disabled={submitting}>
                    {submitting ? 'جاري الإرسال...' : 'تأكيد طلب التسجيل'}
                  </Button>
                </form>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Track Registration Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-house-800">متابعة حالة التسجيل</h3>
              <button onClick={() => setShowTrackModal(false)} className="text-house-400 hover:text-house-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleTrackSubmit} className="mb-6">
              <label className="input-label">كود التتبع الخاص بك</label>
              <div className="flex gap-2">
                <input required className="input-field flex-1 font-mono uppercase" placeholder="QYS-XXXX" value={trackInput} onChange={e => setTrackInput(e.target.value)} />
                <Button type="submit" variant="primary" disabled={tracking}>{tracking ? 'جاري...' : 'بحث'}</Button>
              </div>
              {trackError && <p className="text-sm text-red-500 mt-2">{trackError}</p>}
            </form>

            {trackResult && (
              <div className="p-4 bg-house-50 rounded-lg border space-y-3 animate-fade-in">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-house-500">حالة الطلب:</span>
                  <Badge variant={trackResult.status === 'تم القبول' ? 'growth' : 'gold'}>{trackResult.status}</Badge>
                </div>
                <div>
                  <span className="block text-sm text-house-500">اسم الطالب:</span>
                  <span className="font-semibold text-house-800">{trackResult.name}</span>
                </div>
                <div>
                  <span className="block text-sm text-house-500">الدورة المسجلة:</span>
                  <span className="font-semibold text-house-800">{trackResult.coursename || trackResult.courseName}</span>
                </div>
                <div className="pt-2">
                  <Button variant="secondary" className="w-full text-sm">استكمال بيانات الدفع (قريباً)</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
