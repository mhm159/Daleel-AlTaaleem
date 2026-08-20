'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { SectionHeading, Card, Badge, Loader, Alert } from '../../components/ui/Button';

function NewsCard({ item }) {
  return (
    <Link href={`/news/${item.slug}`}>
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
          <div className="mb-2 flex items-center justify-between">
            <Badge variant={item.category === 'achievement' ? 'gold' : 'sky'}>{item.category === 'achievement' ? 'إنجاز' : item.category === 'event' ? 'فعالية' : 'خبر'}</Badge>
            <span className="text-xs text-house-400">{new Date(item.publishedAt).toLocaleDateString('ar-SA')}</span>
          </div>
          <h3 className="line-clamp-2 font-bold text-house-800 group-hover:text-sky-600">{item.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-house-500">{item.excerpt}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-house-400">بقلم {item.authorId || item.author}</span>
            <span className="text-sm font-semibold text-sky-600">اقرأ المزيد ←</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'news', label: 'أخبار' },
    { id: 'event', label: 'فعاليات' },
    { id: 'achievement', label: 'إنجازات' },
    { id: 'announcement', label: 'إعلانات' },
    { id: 'blog', label: 'مدونة' },
  ];

  useEffect(() => {
    api.get('/news?limit=50')
      .then(data => {
        setNews(data.news || []);
        setFiltered(data.news || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = news;
    if (activeCategory !== 'all') {
      result = result.filter(n => n.category === activeCategory);
    }
    if (search) {
      result = result.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeCategory, search, news]);

  return (
    <>
      <div className="bg-gradient-to-br from-sky-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Badge variant="sky">الأخبار والإعلام</Badge>
          <h1 className="mt-4 text-4xl font-bold text-house-800 md:text-5xl">أخبار ومستجدات المدرسة</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-house-500">
            ابقَ على اطلاع بأحدث الفعاليات والإنجازات والقصص من مجتمعنا المدرسي.
          </p>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat.id ? 'bg-sky-500 text-white' : 'bg-house-100 text-house-600 hover:bg-house-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="ابحث في الأخبار..."
              className="input-field max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <Loader />}
          {error && <Alert type="error" message={error} />}
          {!loading && !error && (
            <>
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-house-400">لا توجد أخبار</div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map(item => <NewsCard key={item.id} item={item} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
