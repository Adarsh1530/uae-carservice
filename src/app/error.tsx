'use client';

import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="max-w-md space-y-6 relative z-10 p-8 rounded-2xl bg-brand-surface border border-red-500/40 shadow-neon-xl">
        <span className="font-mono text-5xl font-black text-red-500 tracking-widest block">
          500
        </span>
        <h1 className="font-heading font-black text-2xl text-white">SOMETHING WENT WRONG</h1>
        <p className="text-xs text-gray-400">
          An internal application error occurred. Please try refreshing or return to homepage.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-heading font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase"
          >
            <Home className="w-4 h-4" />
            <span>HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
