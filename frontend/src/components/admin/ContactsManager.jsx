'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, Loader } from '../ui/Button';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await api.get('/contacts?limit=50');
      setContacts(data.contacts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contacts/${id}`, { status });
      loadContacts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-house-800">رسائل التواصل</h2>
      <div className="space-y-4">
        {contacts.map((c) => (
          <Card key={c._id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-house-800 text-lg">{c.name}</div>
                <div className="text-xs text-house-400 mt-1">{c.email} • {new Date(c.createdAt).toLocaleDateString('ar-SA')}</div>
              </div>
              <span className={`badge ${c.status === 'new' ? 'badge-gold' : c.status === 'replied' ? 'badge-growth' : 'badge-sky'}`}>
                {c.status === 'new' ? 'جديد' : c.status === 'read' ? 'مقروء' : c.status === 'replied' ? 'تم الرد' : 'مغلق'}
              </span>
            </div>
            <div className="mt-4 p-4 bg-house-50 rounded-lg">
              <p className="text-sm font-bold text-house-800 mb-2">{c.subject}</p>
              <p className="text-sm text-house-600 whitespace-pre-wrap">{c.message}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <select
                className="input-field py-1 text-sm w-32 border-gray-300 rounded"
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
              >
                <option value="new">جديد</option>
                <option value="read">مقروء</option>
                <option value="replied">تم الرد</option>
                <option value="closed">مغلق</option>
              </select>
            </div>
          </Card>
        ))}
        {contacts.length === 0 && (
          <Card className="p-8 text-center text-house-500">
            لا توجد رسائل حالياً
          </Card>
        )}
      </div>
    </div>
  );
}
