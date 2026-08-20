# 📋 سجل تطوير مشروع Learning Guide Schools

> هذا الملف يوثّق تاريخ التعديلات خطوة بخطوة (يُحدّث بعد كل تعديل جوهري).

---

## ✅ الحالة الحالية (آخر تحديث: 2026-08-20)

المشروع **يعمل بالكامل** على القسم `I:` (نفس مجلد المشروع، بدون أقسام أخرى).
- الباك-إند: Express + SQLite على المنفذ 5000 ✓
- الفرونت-إند: Next.js dev على المنفذ 3000 ✓
- قاعدة البيانات: SQLite (`backend/database.sqlite`) ✓
- ملف التشغيل: `start.bat` (بنقرة واحدة + إغلاق تلقائي) ✓

---

## 📅 السجل الزمني

### 2026-08-20 — الجلسة 1: البناء الأولي + التحويل إلى SQLite

**المشكلة الأصلية:** المشروع طُلب بـ MongoDB، لكن الجهاز لا يحتوي MongoDB مثبّتاً، ونظام الملفات على `I:` هو vfat الذي يسبب فشل بناء Next.js production وأخطاء node_modules.

**ما تم إنجازه:**
1. بناء الهيكل الكامل (Next.js + Express + MongoDB models أولياً)
2. إنشاء كل الصفحات: Home, About, Admissions, Academics, News, Portal, Contact, Admin
3. تصميم النظام البصري (سماوي/أخضر/ذهبي) حسب شعار المدرسة
4. محاولة تشغيل MongoDB محلياً → فشل (مسار vfat + خروج 100)
5. **القرار:** تحويل الباك-إند بالكامل من Mongoose/MongoDB إلى **SQLite** (`better-sqlite3`)
   - حذف `src/models/` (Mongoose)
   - إنشاء `src/db/` (طبقة SQLite + repositories لكل كيان)
   - إعادة كتابة كل الـ controllers والـ routes لاستخدام repositories
   - إصلاح خطأ في `layout.jsx`: كان `./styles/globals.css` والصحيح `../styles/globals.css`
6. إصلاح خطأ seed: `WHERE role = "admin"` → `WHERE role = 'admin'` (SQLite يتطلب اقتباس مفرد)
7. البناء على `I:` بـ `next build` فشل (vfat) لكن `next dev` **يعمل بنجاح**
8. إنشاء `start.bat` لتشغيل السيرفرين معاً مع إغلاق تلقائي
9. **اختبار فعلي:** الموقع استجاب HTTP 200، الأخبار (5) والتقويم (5) محقونة بنجاح

**معرّفات الدخول التجريبية:**
- Admin: `admin@learningguide.school` / `admin123`
- Parent: `parent@learningguide.school` / `parent123`
- Teacher: `teacher@learningguide.school` / `teacher123`

---

## 🐛 المشاكل المعالجة (Lessons Learned)

| المشكلة | السبب | الحل |
|---------|-------|------|
| MongoDB لا يعمل على الجهاز | غير مثبّت + قيود vfat | التحويل إلى SQLite |
| `next build` يفشل على I: | نظام ملفات vfat | استخدام `next dev` بدل build |
| أخطاء webpack `Can't resolve '../components/...'` | تالف node_modules بسبب النسخ عبر الأقسام | بناء نظيف + aliases `@/` |
| seed لا يحقن البيانات | اقتباس مزدوج في SQLite | اقتباس مفرد `'admin'` |
| `layout.jsx` يسقط التطبيق | مسار CSS خاطئ `./` بدل `../` | تصحيح المسار |

---

## 📝 خطة المتابعة (إن وُجدت)

- [ ] اختبار صفحات البوابة (Portal) والإدارة (Admin) فعلياً في المتصفح
- [ ] التحقق من عرض الأحداث (upcoming) وتصحيح منطق التاريخ إن لزم
- [ ] تحسين تجاوب الموبايل للوحات البوابة
- [ ] ربط Stripe حقيقي بمفتاح فعلي
- [ ] إضافة رفع الملفات في نموذج القبول
