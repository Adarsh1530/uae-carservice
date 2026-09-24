'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Award,
  ArrowRight,
  ExternalLink,
  Loader2,
  Calendar,
} from 'lucide-react';

function LoyaltyVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token && !id) {
      setError('Invalid or missing QR verification code.');
      setLoading(false);
      return;
    }

    fetch('/api/loyalty/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: id || token }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.customer) {
          setData(resData);
        } else {
          setError(resData.error || 'Verification failed: Member record not found.');
        }
      })
      .catch((e) => {
        console.error(e);
        setError('Network error during verification.');
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-brand-surface border border-brand-green/60 p-6 sm:p-8 text-center shadow-neon-lg relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-brand-green/20 blur-2xl pointer-events-none" />

        {/* Circular Logo */}
        <div className="relative w-16 h-16 rounded-full border-2 border-brand-green p-1 bg-black mx-auto mb-4 shadow-neon-sm">
          <Image src="/icon.svg" alt="WALESS Logo" fill className="object-contain p-1" />
        </div>

        {loading ? (
          <div className="py-12">
            <Loader2 className="w-8 h-8 text-brand-green animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-gray-400">Verifying WALESS VIP Pass...</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="font-heading font-black text-xl text-white">Verification Failed</h2>
            <p className="text-xs text-gray-400 mt-2 font-mono">{error}</p>
            <Link
              href="/loyalty"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider"
            >
              Go to Loyalty Club
            </Link>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-brand-green text-xs font-mono font-bold uppercase mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official WALESS Verified Pass</span>
            </div>

            <h2 className="font-heading font-black text-2xl text-white">
              {data.customer.fullName}
            </h2>
            <p className="text-xs font-mono text-brand-green mt-1 font-bold">
              {data.customer.loyaltyId}
            </p>

            <div className="my-6 p-4 rounded-2xl bg-black/60 border border-brand-border text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle / Plate:</span>
                <span className="text-white font-bold">
                  {data.customer.plateNumber || 'REGISTERED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Progress:</span>
                <span className="text-brand-green font-bold text-sm">
                  {data.customer.currentStamps} / {data.config?.stampsPerReward || 4} Stamps
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member Status:</span>
                <span className="text-emerald-400 font-bold uppercase">
                  {data.customer.status} VIP
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href={`/admin/loyalty?lookup=${data.customer.loyaltyId}`}
                className="w-full py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Open in Workshop Terminal (Staff)</span>
              </Link>

              <Link
                href={`/loyalty?lookup=${data.customer.loyaltyId}`}
                className="w-full py-2.5 rounded-xl bg-black border border-brand-border text-gray-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2"
              >
                <span>View Full Digital Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoyaltyVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white pt-32 flex items-center justify-center">
          <div className="text-brand-green font-mono text-xs">Loading Pass Verification...</div>
        </div>
      }
    >
      <LoyaltyVerifyContent />
    </Suspense>
  );
}

