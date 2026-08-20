'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../../lib/api';
import { Button, Alert, Loader } from '../ui/Button';

export default function LoginForm({ onSuccess, title = 'تسجيل الدخول للنظام الموحد', subtitle = 'أدخل بريدك الإلكتروني للوصول إلى لوحة التحكم الخاصة بك' }) {
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
          <h2 className="text-2xl font-bold text-house-800">{title}</h2>
          <p className="mt-2 text-sm text-house-500">{subtitle}</p>
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
              placeholder="user@learningguide.school"
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


      </Card>
    </div>
  );
}

// Need Card import
import { Card } from '../ui/Button';
