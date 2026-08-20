'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../../lib/api';
import { Button, Alert, Loader } from '../ui/Button';

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      if (data.success) {
        onSuccess && onSuccess();
      } else {
        setError(data.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-house-800">تسجيل الدخول لبوابة ولي الأمر</h2>
          <p className="mt-2 text-sm text-house-500">تابع تقدم طفلك، حضوره، والمزيد</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="input-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
              required
            />
          </div>
          <div>
            <label className="input-label">كلمة المرور</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              <span className="text-house-500">تذكرني</span>
            </label>
            <button type="button" className="text-sky-600 hover:underline">نسيت كلمة المرور؟</button>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'جارِ تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-sky-50 p-4 text-sm">
          <p className="font-semibold text-sky-700">بيانات تجريبية:</p>
          <p className="mt-1 text-house-600">ولي الأمر: parent@learningguide.school / parent123</p>
          <p className="text-house-600">المعلم: teacher@learningguide.school / teacher123</p>
          <p className="text-house-600">الإدارة: admin@learningguide.school / admin123</p>
        </div>
      </Card>
    </div>
  );
}

// Need Card import
import { Card } from '../ui/Button';
