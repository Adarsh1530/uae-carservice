import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md space-y-6 relative z-10 p-8 rounded-2xl bg-brand-surface border border-brand-green/30 shadow-neon-xl">
        <span className="font-mono text-5xl font-black text-brand-green tracking-widest block neon-glow-text">
          404
        </span>
        <h1 className="font-heading font-black text-2xl text-white">PAGE NOT FOUND</h1>
        <p className="text-xs text-gray-400">
          The requested page could not be located on the WHALESS GROUP platform.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO HOMEPAGE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
