'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import LappySquareLogo from '@/components/ui/LappySquareLogo';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const urlError = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === 'unauthorized'
      ? 'Access restricted: Please sign in with an Administrator or Staff account.'
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Check if user is admin redirect accordingly
      if (data.user?.role === 'SUPER_ADMIN' || data.user?.role === 'ADMIN' || data.user?.role === 'CONTENT_MANAGER') {
        router.push(from === '/' ? '/admin' : from);
      } else {
        // Customer accounts cannot access the admin panel
        if (from.startsWith('/admin')) {
          setError('Access denied: Your account does not have Administrator privileges.');
          setLoading(false);
          return;
        }
        router.push(from);
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-[85vh] py-14 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        
        {/* Brand Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center mb-1 group">
              <LappySquareLogo size={52} variant="horizontal" />
            </Link>
            
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin & Staff Portal</h1>
              <p className="text-xs text-slate-500">
                Authorized management access for Lappy Square administrators.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Registered Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>256-Bit Encrypted Portal • Safe & Verified</span>
        </div>

      </div>
    </div>
  );
}
