'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  Gift,
  QrCode,
  Share2,
  Calendar,
  Sparkles,
  Car,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';
import { LoyaltyCustomerItem, LoyaltyConfig } from '@/lib/types';

interface DigitalLoyaltyCardProps {
  customer: LoyaltyCustomerItem & { qrSvg?: string; whatsappUrl?: string };
  config?: LoyaltyConfig | null;
  onRefresh?: () => void;
}

export const DigitalLoyaltyCard: React.FC<DigitalLoyaltyCardProps> = ({
  customer,
  config,
  onRefresh,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const stampsPerReward = config?.stampsPerReward || 4;
  const currentStamps = customer.currentStamps || 0;
  const targetRewardTitle = config?.rewardTitle || '1 FREE BESPOKE FINISH';
  const tagline = config?.programTagline || `BUY ${stampsPerReward} SERVICES = 1 FREE BESPOKE FINISH`;
  const isRewardUnlocked = currentStamps >= stampsPerReward;

  // Generate slots: 1 to stampsPerReward
  const stampSlots = Array.from({ length: stampsPerReward }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Physical Luxury Card Simulation */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#181818] via-[#0D0D0D] to-black border-2 border-brand-green/40 shadow-neon-md hover:shadow-neon-lg transition-all duration-500 overflow-hidden text-white group">
        {/* Subtle carbon weave / grid texture overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(0, 255, 102, 0.25) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-brand-green/15 blur-3xl pointer-events-none" />

        {/* Card Header: Official Circular Logo & Program Title */}
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brand-green shadow-neon-sm bg-black overflow-hidden mb-3 p-1">
            <Image
              src="/icon.svg"
              alt="WALESS Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>

          <span className="text-[11px] font-mono tracking-[0.3em] text-brand-green uppercase font-bold">
            WALESS GROUP AUTO SERVICE
          </span>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wider mt-0.5">
            VIP LOYALTY PASS
          </h2>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-heading font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tagline}</span>
          </div>
        </div>

        {/* Card Middle: Dynamic Stamp Slots Sequence */}
        <div className="relative z-10 py-4 my-2 border-y border-brand-border/40">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {stampSlots.map((slotNum) => {
              const isStamped = slotNum <= currentStamps;
              return (
                <div
                  key={slotNum}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ${
                    isStamped
                      ? 'bg-gradient-to-br from-brand-green to-emerald-600 text-black shadow-neon-sm ring-2 ring-brand-green ring-offset-2 ring-offset-black scale-105'
                      : 'bg-neutral-900/90 border border-neutral-700 text-neutral-400'
                  }`}
                >
                  {isStamped ? (
                    <div className="flex flex-col items-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                      <span className="text-[8px] font-bold tracking-tighter uppercase font-mono">
                        STAMPED
                      </span>
                    </div>
                  ) : (
                    <span className="font-heading font-black text-base sm:text-lg text-neutral-300">
                      {slotNum}
                    </span>
                  )}
                </div>
              );
            })}

            {/* 5th / Final Reward Slot */}
            <div
              className={`relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-300 ${
                isRewardUnlocked
                  ? 'bg-gradient-to-br from-brand-green to-lime-400 text-black shadow-neon-md ring-2 ring-brand-green ring-offset-2 ring-offset-black animate-pulse scale-110 font-bold'
                  : 'bg-brand-surface border-2 border-dashed border-brand-green/50 text-brand-green'
              }`}
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[8px] font-heading font-black tracking-tight text-center leading-none mt-0.5">
                {isRewardUnlocked ? 'CLAIM' : 'FREE'}
              </span>
            </div>
          </div>

          {/* Progress Caption */}
          <div className="mt-3 text-center">
            <span className="text-xs font-mono text-gray-300">
              Progress:{' '}
              <strong className="text-brand-green font-bold text-sm">
                {currentStamps}
              </strong>{' '}
              / {stampsPerReward} Services Completed
            </span>
            {isRewardUnlocked && (
              <p className="text-xs text-brand-green font-bold uppercase tracking-wider mt-1 animate-bounce">
                🎉 Reward Unlocked! Claim your free service at the workshop!
              </p>
            )}
          </div>
        </div>

        {/* Card Bottom: Customer & Vehicle Information Box */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-black/60 border border-brand-border/40">
            <span className="text-gray-400 block text-[10px] uppercase">Client Name</span>
            <span className="font-heading font-bold text-white text-sm truncate block mt-0.5">
              {customer.fullName}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/60 border border-brand-border/40">
            <span className="text-gray-400 block text-[10px] uppercase">Plate / Vehicle</span>
            <span className="font-heading font-bold text-brand-green text-sm truncate block mt-0.5">
              {customer.plateNumber || 'REGISTERED'}{' '}
              {customer.vehicleMake ? `• ${customer.vehicleMake}` : ''}
            </span>
          </div>
        </div>

        {/* Card Footer Bar: ID, Status & Quick Action Buttons */}
        <div className="relative z-10 mt-5 pt-4 border-t border-brand-border/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white bg-brand-surface px-2.5 py-1 rounded-md border border-brand-border">
              {customer.loyaltyId}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-brand-green text-[10px] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
              {customer.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-black font-heading font-bold text-xs uppercase tracking-wider border border-brand-green/40 transition-all shadow-neon-sm"
              title="Show QR Code for Workshop Staff"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show QR</span>
            </button>

            {customer.whatsappUrl && (
              <a
                href={customer.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-brand-green hover:bg-emerald-900/40 font-heading font-bold text-xs uppercase tracking-wider transition-all"
                title="Send pass to WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black border border-brand-border text-gray-300 hover:text-white text-xs font-mono transition-all"
              title="View Loyalty History"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Workshop Scanning */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-brand-surface border border-brand-green p-6 text-center shadow-neon-lg">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-brand-green uppercase tracking-widest font-bold">
                WORKSHOP SCAN PASS
              </span>
              <h3 className="font-heading font-black text-xl text-white mt-1">
                {customer.fullName}
              </h3>
              <p className="text-xs font-mono text-gray-400 mt-0.5">
                ID: {customer.loyaltyId}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-black border border-brand-border shadow-neon-inset mx-auto w-56 h-56 flex items-center justify-center">
              {customer.qrSvg ? (
                <div
                  className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: customer.qrSvg }}
                />
              ) : (
                <QrCode className="w-32 h-32 text-brand-green animate-pulse" />
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Show this QR code to the WALESS GROUP workshop team in Ras Al Khaimah to collect your service stamps or claim rewards.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider shadow-neon-sm hover:bg-brand-greenLight transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* History & Transactions Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-brand-surface border border-brand-border p-6 shadow-neon-lg max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4">
              <div>
                <h3 className="font-heading font-black text-lg text-white">
                  Loyalty Activity History
                </h3>
                <p className="text-xs font-mono text-gray-400">
                  {customer.fullName} • {customer.loyaltyId}
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 rounded-full bg-black text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {customer.transactions && customer.transactions.length > 0 ? (
                customer.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-black/60 border border-brand-border/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-heading font-bold text-white block">
                        {tx.type === 'STAMP_EARNED'
                          ? '⭐ Service Stamp Added'
                          : tx.type === 'REWARD_REDEEMED'
                          ? '🎁 Reward Redeemed'
                          : tx.type === 'ACCOUNT_CREATED'
                          ? '🎉 VIP Account Created'
                          : tx.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                        {tx.serviceName || tx.notes || 'Service visit'} •{' '}
                        {new Date(tx.createdAt).toLocaleDateString('en-AE', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          tx.amount > 0
                            ? 'text-brand-green'
                            : tx.amount < 0
                            ? 'text-amber-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono block">
                        Bal: {tx.balanceAfter}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500 font-mono text-xs">
                  No activity recorded yet. Visit our Ras Al Khaimah workshop for your first service stamp!
                </div>
              )}
            </div>

            <div className="border-t border-brand-border pt-4 mt-4">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full py-2.5 rounded-xl bg-black border border-brand-border text-white hover:text-brand-green text-xs font-heading font-bold uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
