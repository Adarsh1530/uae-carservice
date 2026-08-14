'use client';

import React from 'react';
import { clsx } from 'clsx';

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'green' | 'soft' | 'subtle';
  active?: boolean;
}

export const GlowBorder: React.FC<GlowBorderProps> = ({
  children,
  className = '',
  glowColor = 'green',
  active = true,
}) => {
  return (
    <div className={clsx('relative group', className)}>
      {/* Ambient background glow */}
      {active && (
        <div
          className={clsx(
            'absolute -inset-0.5 rounded-xl opacity-40 group-hover:opacity-100 transition duration-500 blur-md pointer-events-none',
            glowColor === 'green' && 'bg-gradient-to-r from-brand-green/50 via-emerald-400/40 to-brand-neon/60',
            glowColor === 'soft' && 'bg-brand-green/20',
            glowColor === 'subtle' && 'bg-white/10'
          )}
        />
      )}
      {/* Content wrapper */}
      <div className="relative rounded-xl bg-brand-surface border border-brand-border group-hover:border-brand-green/60 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};
