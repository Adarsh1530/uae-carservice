'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('WALESSGROUP');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (e) {
      console.error('Login error:', e);
      setErrorMsg('Network error authenticating session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-brand-surface border border-brand-green/40 rounded-2xl shadow-neon-xl p-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 shadow-neon-md">
            <Image src="/icon.svg" alt="WALESS GROUP Logo" fill className="object-contain p-1" priority />
          </div>
          <span className="text-[10px] font-mono text-brand-green uppercase tracking-widest block font-semibold">
            WALESS GROUP CMS
          </span>
          <h1 className="font-heading font-black text-2xl text-white tracking-tight mt-1">
            Administrator Access
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in to manage bookings, services, gallery, and site settings.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs text-center font-medium animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-green absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-mono focus:border-brand-green focus:ring-1 focus:ring-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-green absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-mono focus:border-brand-green focus:ring-1 focus:ring-brand-green"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>SIGN IN TO DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-brand-border/40 text-center">
          <span className="text-[10px] font-mono text-gray-500">
            WALESS GROUP • Ras Al Khaimah, UAE
          </span>
        </div>
      </div>
    </div>
  );
}
