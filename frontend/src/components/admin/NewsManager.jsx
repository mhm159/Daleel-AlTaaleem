'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, Button, Loader } from '../ui/Button';
import toast from 'react-hot-toast';

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: 'news', status: 'draft', image: '',
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await api.get('/news/admin/all?limit=50');
      setNews(data.news || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!form.title) {
      toast.error('الرجاء إدخال عنوان المقال أولاً ليتمكن الذكاء الاصطناعي من الكتابة عنه.');
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, promptType: 'news' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في التوليد');
      
      setForm(prev => ({
        ...prev,
        content: data.content,
        excerpt: data.excerpt
      }));
      toast.success('تم التوليد بنجاح!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/news', { ...form, id: editing?._id });
      setEditing(null);
      setForm({ title: '', content: '', excerpt: '', category: 'news', status: 'draft', image: '' });
      toast.success(editing ? 'تم تحديث المقال' : 'تم نشر المقال');
      loadNews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا المقال؟')) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success('تم الحذف بنجاح');
      loadNews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">إدارة الأخبار والمدونة</h2>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-house-800">{editing ? 'تعديل مقال' : 'مقال جديد'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 relative">
              <label className="input-label">العنوان</label>
              <div className="flex gap-2">
                <input className="input-field flex-1" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="مثال: أهمية التكنولوجيا في التعليم الحديث" />
                <Button type="button" variant="gold" onClick={handleGenerateAI} disabled={generating || !form.title} className="whitespace-nowrap px-4 py-2 text-sm flex items-center gap-1">
                  <span>✨</span> {generating ? 'جاري التوليد...' : 'توليد بالذكاء الاصطناعي'}
                </Button>
              </div>
            </div>
            <div>
              <label className="input-label">التصنيف</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="news">أخبار</option>
                <option value="event">فعالية</option>
                <option value="achievement">إنجاز</option>
                <option value="announcement">إعلان</option>
                <option value="blog">مدونة</option>
              </select>
            </div>
            <div>
              <label className="input-label">الحالة</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">رابط الصورة</label>
              <input className="input-field" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">مقتطف</label>
              <textarea className="input-field" rows="2" value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">المحتوى</label>
              <textarea className="input-field" rows="6" required value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button type="submit" variant="primary">{editing ? 'تحديث' : 'نشر'}</Button>
            {editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); setForm({ title: '', content: '', excerpt: '', category: 'news', status: 'draft', image: '' }); }}>إلغاء</Button>}
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {news.map((n) => (
          <Card key={n._id} className="flex items-center justify-between p-4 hover:border-sky-300 transition-colors">
            <div className="flex items-center space-x-4">
              {n.image && <img src={n.image} alt="" className="h-12 w-12 rounded object-cover" />}
              <div>
                <div className="font-semibold text-house-800">{n.title}</div>
                <div className="flex items-center space-x-2 text-xs text-house-400 mt-1">
                  <span className={`badge ${n.status === 'published' ? 'badge-growth' : 'badge-gold'}`}>{n.status}</span>
                  <span>{n.category}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => { setEditing(n); setForm({ title: n.title, content: n.content, excerpt: n.excerpt || '', category: n.category, status: n.status, image: n.image || '' }); }}>تعديل</Button>
              <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(n._id)}>حذف</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
