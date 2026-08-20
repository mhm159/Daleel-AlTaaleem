'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Badge, Loader, Alert, Button } from '../../../components/ui/Button';

export default function NewsArticle() {
  const params = useParams();
  const slug = params.slug;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/news/${slug}`)
      .then(data => {
        if (data.success) {
          setArticle(data.news);
        } else {
          setError('المقال غير موجود');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader text="جارِ تحميل المقال..." />;
  if (error) return (
    <div className="py-20 text-center">
      <Alert type="error" message={error} />
      <Link href="/news" className="btn-primary mt-4 inline-block">العودة للأخبار</Link>
    </div>
  );

  if (!article) return null;

  return (
    <article className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-96 overflow-hidden bg-sky-100">
        {article.image ? (
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sky-300">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-4xl">
            <Badge variant={article.category === 'achievement' ? 'gold' : 'sky'}>{article.category === 'achievement' ? 'إنجاز' : article.category === 'event' ? 'فعالية' : 'خبر'}</Badge>
            <h1 className="mt-3 text-3xl font-bold text-white text-shadow md:text-4xl">{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-house-100 pb-4">
          <div className="text-sm text-house-500">
            بقلم <span className="font-medium text-house-700">{article.authorId || article.author}</span>
            {' • '}
            {new Date(article.publishedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' • '}
            {article.views} مشاهدة
          </div>
          <Link href="/news" className="text-sm font-semibold text-sky-600 hover:underline">← العودة للأخبار</Link>
        </div>

        {article.excerpt && (
          <p className="mb-6 text-lg font-medium text-house-600 italic">{article.excerpt}</p>
        )}

        <div className="prose max-w-none text-house-700">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed">{para}</p>
          ))}
        </div>

        {article.images && article.images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {article.images.map((img, i) => (
              <img key={i} src={img} alt={`Image ${i+1}`} className="rounded-lg" />
            ))}
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="rounded-full bg-house-100 px-3 py-1 text-sm text-house-600">#{tag}</span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-12 rounded-2xl bg-sky-50 p-6 text-center">
          <h3 className="font-bold text-house-800">شارك هذه القصة</h3>
          <div className="mt-4 flex justify-center space-x-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm hover:bg-sky-600 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm hover:bg-sky-600 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm hover:bg-sky-600 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/news" className="btn-secondary">← العودة لجميع الأخبار</Link>
        </div>
      </div>
    </article>
  );
}
