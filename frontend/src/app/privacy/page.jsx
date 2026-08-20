import React from 'react';

export const metadata = {
  title: 'سياسة الخصوصية | مدارس دليل التعلم',
  description: 'سياسة الخصوصية الخاصة بمدارس دليل التعلم الأهلية.',
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-house-50 min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-house-800 mb-6">سياسة الخصوصية</h1>
          <p className="text-house-500 mb-8">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
          
          <div className="space-y-6 text-house-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-sky-700 mb-3">1. جمع المعلومات</h2>
              <p>
                نحن في مدارس دليل التعلم نقوم بجمع المعلومات الشخصية التي تقدمها لنا عند التسجيل في موقعنا، أو عند ملء استمارات التقديم، أو عند التواصل معنا. قد تشمل هذه المعلومات الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات الطالب الأكاديمية والشخصية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sky-700 mb-3">2. استخدام المعلومات</h2>
              <p>
                نستخدم المعلومات التي نجمعها لعدة أغراض، منها:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-house-600">
                <li>معالجة طلبات القبول والتسجيل.</li>
                <li>التواصل معك بشأن تقدم الطالب أو التحديثات المدرسية.</li>
                <li>تحسين خدماتنا وتجربة المستخدم على منصتنا الإلكترونية.</li>
                <li>تلبية المتطلبات القانونية والتنظيمية لوزارة التعليم.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sky-700 mb-3">3. حماية البيانات</h2>
              <p>
                نتخذ إجراءات أمنية صارمة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء أو الإتلاف. نستخدم تقنيات التشفير المتقدمة والخوادم الآمنة لضمان سرية معلوماتك.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sky-700 mb-3">4. مشاركة المعلومات</h2>
              <p>
                لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. قد نشارك بعض المعلومات مع الجهات الحكومية المختصة (مثل وزارة التعليم) عند الضرورة وبموجب الأنظمة والقوانين المعمول بها في المملكة العربية السعودية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sky-700 mb-3">5. حقوقك</h2>
              <p>
                يحق لك طلب الوصول إلى معلوماتك الشخصية التي نحتفظ بها، أو طلب تصحيحها، أو حذفها في بعض الحالات. يمكنك ممارسة هذه الحقوق من خلال التواصل مع إدارة المدرسة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sky-700 mb-3">6. التحديثات على سياسة الخصوصية</h2>
              <p>
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة، وننصحك بمراجعتها بانتظام.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
