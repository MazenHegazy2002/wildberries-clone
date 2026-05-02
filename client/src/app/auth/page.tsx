'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import api from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Demo mode - simulate login
        const demoUser = { id: '1', email: form.email, name: 'Demo User', role: 'USER' as const };
        setUser(demoUser, 'demo-token');
        localStorage.setItem('token', 'demo-token');
        router.push('/');
      } else {
        // Demo mode - simulate register
        const demoUser = { id: '1', email: form.email, name: form.name, role: 'USER' as const };
        setUser(demoUser, 'demo-token');
        localStorage.setItem('token', 'demo-token');
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-8">
      <div className="max-w-[400px] mx-auto">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h1 className="text-xl font-bold text-center mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="text-xs text-gray-400 block mb-1">Name</label>
                <input 
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <input 
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input 
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-1">Phone (optional)</label>
                <input 
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#CB11AB] text-white border-none rounded-lg text-base font-bold cursor-pointer hover:bg-[#9c0082] disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[#CB11AB] ml-1 cursor-pointer hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 text-center">
              Demo mode: Enter any email/password to test
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}