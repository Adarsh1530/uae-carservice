'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Lock, Key, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminProfilePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 12) {
      setMessage({ type: 'error', text: 'New password must be at least 12 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Server error changing password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b border-brand-border pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
          ACCOUNT SECURITY
        </span>
        <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-1">
          Admin Profile & Security
        </h1>
      </div>

      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-neon-sm border border-brand-green/40">
          <Image src="/icon.svg" alt="WALESS GROUP Logo" fill className="object-contain p-1" priority />
        </div>
        <div>
          <h2 className="font-heading font-bold text-white text-lg">WALESSGROUP</h2>
          <p className="text-xs text-brand-muted font-mono">Role: System Administrator (Master)</p>
          <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono">
            ● Active Authenticated Session
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-6">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-heading font-bold text-lg text-white border-l-2 border-brand-green pl-3">
            Change Master Password
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Choose a strong password with at least 12 characters containing letters, numbers, and symbols.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border-red-500/50 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
              New Password (Min 12 Chars) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
              <input
                type="password"
                required
                minLength={12}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPDATING PASSWORD...</span>
                </span>
              ) : (
                'UPDATE PASSWORD'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
