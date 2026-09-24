'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Award,
  Sparkles,
  Search,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Car,
  QrCode,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { DigitalLoyaltyCard } from '@/components/loyalty/DigitalLoyaltyCard';
import { LoyaltyCustomerItem, LoyaltyConfig, LoyaltyRewardItem } from '@/lib/types';

function LoyaltyContent() {
  const searchParams = useSearchParams();
  const initialLookup = searchParams.get('lookup') || '';

  const [activeTab, setActiveTab] = useState<'access' | 'join'>('access');
  const [config, setConfig] = useState<LoyaltyConfig | null>(null);
  const [rewards, setRewards] = useState<LoyaltyRewardItem[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState(initialLookup);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<(LoyaltyCustomerItem & { qrSvg?: string; whatsappUrl?: string }) | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Registration state
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    plateNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Fetch initial config & active rewards
  useEffect(() => {
    fetch('/api/loyalty/config?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(data.config);
          if (data.rewards) setRewards(data.rewards);
        }
      })
      .catch((e) => console.warn('Failed to load loyalty config:', e))
      .finally(() => setLoadingConfig(false));
  }, []);

  // Auto-run lookup if lookup query parameter was supplied in URL
  useEffect(() => {
    if (initialLookup && initialLookup.trim()) {
      handleLookup(initialLookup.trim());
    }
  }, [initialLookup]);

  const handleLookup = async (queryToSearch?: string) => {
    const query = (queryToSearch || lookupQuery).trim();
    if (!query) {
      setLookupError('Please enter your mobile phone number or Loyalty ID.');
      return;
    }

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch('/api/loyalty/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: query }),
      });
      const data = await res.json();

      if (data.success && data.customer) {
        setActiveCustomer(data.customer);
        if (data.config) setConfig(data.config);
      } else {
        setLookupError(data.error || 'No loyalty account found. Please check your number or register.');
      }
    } catch (err) {
      console.error(err);
      setLookupError('Unable to connect to server. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);

    if (!regForm.fullName.trim() || !regForm.phone.trim()) {
      setRegError('Full Name and UAE Mobile Number are required.');
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch('/api/loyalty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();

      if (data.success && data.customer) {
        setActiveCustomer(data.customer);
        if (data.config) setConfig(data.config);
        setRegSuccessMessage('Congratulations! Your WALESS VIP Loyalty Pass is now active.');
        setActiveTab('access');
      } else {
        setRegError(data.error || 'Failed to register account.');
      }
    } catch (err) {
      console.error(err);
      setRegError('Server error processing registration. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const stampsPerReward = config?.stampsPerReward || 4;
  const programTitle = config?.programName || 'WALESS VIP LOYALTY PASS';
  const tagline = config?.programTagline || `BUY ${stampsPerReward} SERVICES = 1 FREE BESPOKE FINISH`;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 selection:bg-brand-green selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-green/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-950/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-heading font-bold uppercase tracking-wider mb-4 shadow-neon-sm">
            <Sparkles className="w-4 h-4" />
            <span>Official Client Rewards Program</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase">
            {programTitle}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
            {tagline}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-gray-500 font-mono">
            Earn official digital stamps with every vehicle service or customization visit at WALESS GROUP Ras Al Khaimah.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-brand-surface border border-brand-border inline-flex gap-1 shadow-neon-sm">
            <button
              onClick={() => setActiveTab('access')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'access'
                  ? 'bg-brand-green text-black shadow-neon-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Access My Pass</span>
            </button>

            <button
              onClick={() => setActiveTab('join')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'join'
                  ? 'bg-brand-green text-black shadow-neon-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Join Loyalty Club</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Form / Search Card */}
          <div className="lg:col-span-6 bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-neon-sm">
            {activeTab === 'access' ? (
              <div>
                <div className="mb-6">
                  <h2 className="font-heading font-black text-xl text-white">
                    Look Up Your Digital Pass
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Enter your registered UAE mobile phone number or Member ID to view your stamps and available rewards.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLookup();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                      Mobile Number or Loyalty ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 0501234567 or WG-VIP-1029"
                        value={lookupQuery}
                        onChange={(e) => setLookupQuery(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-brand-border text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>
                  </div>

                  {lookupError && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{lookupError}</span>
                    </div>
                  )}

                  {regSuccessMessage && (
                    <div className="p-3.5 rounded-xl bg-brand-green/10 border border-brand-green/40 text-brand-green text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{regSuccessMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="w-full py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {lookupLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Finding Your Pass...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>View My Loyalty Pass</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-brand-border/40 text-center">
                  <p className="text-xs text-gray-400">
                    Not a VIP Member yet?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('join')}
                      className="text-brand-green hover:underline font-bold"
                    >
                      Register in 30 seconds
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="font-heading font-black text-xl text-white">
                    Register for WALESS VIP Pass
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Free instant enrollment. Collect stamps with every service visit and unlock complimentary bespoke automotive finishes.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohammed Al-Hashimi"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                        UAE Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 050 123 4567"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                        Vehicle Plate Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RAK A 78912"
                        value={regForm.plateNumber}
                        onChange={(e) => setRegForm({ ...regForm, plateNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                        Vehicle Make & Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Porsche 911 / Mercedes G63"
                        value={regForm.vehicleMake}
                        onChange={(e) => setRegForm({ ...regForm, vehicleMake: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="client@domain.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {regLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating VIP Pass...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Generate Instant VIP Loyalty Pass</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Digital Loyalty Card Display */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {activeCustomer ? (
              <DigitalLoyaltyCard
                customer={activeCustomer}
                config={config}
                onRefresh={() => handleLookup(activeCustomer.loyaltyId)}
              />
            ) : (
              <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-brand-surface/60 border border-dashed border-brand-border/60 text-center flex flex-col items-center justify-center min-h-[360px]">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green mb-4 shadow-neon-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Your Digital VIP Card Will Appear Here
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mt-2 leading-relaxed font-mono">
                  Enter your phone number on the left to pull up your card, or sign up to generate your new VIP Loyalty Pass immediately.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section: How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono text-brand-green uppercase tracking-[0.25em] font-bold">
              SIMPLE & REWARDING
            </span>
            <h2 className="font-heading font-black text-3xl text-white uppercase tracking-tight mt-1">
              How WALESS Loyalty Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Instant Registration',
                desc: 'Join in seconds online or at our workshop reception in Ras Al Khaimah.',
                icon: UserPlus,
              },
              {
                step: '02',
                title: 'Collect Service Stamps',
                desc: `Receive 1 verified stamp on your digital pass with each qualifying service visit.`,
                icon: Award,
              },
              {
                step: '03',
                title: 'Unlock Milestone Rewards',
                desc: `Accumulate ${stampsPerReward} stamps to automatically unlock your complimentary service reward.`,
                icon: Gift,
              },
              {
                step: '04',
                title: 'Redeem at Workshop',
                desc: 'Present your pass QR code or Member ID upon vehicle drop-off to enjoy your reward.',
                icon: QrCode,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden group hover:border-brand-green/50 transition-all duration-300"
              >
                <div className="text-3xl font-heading font-black text-brand-green/30 group-hover:text-brand-green transition-colors mb-3">
                  {item.step}
                </div>
                <item.icon className="w-6 h-6 text-brand-green mb-3" />
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Active Rewards Catalog */}
        {rewards.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="text-[11px] font-mono text-brand-green uppercase tracking-[0.25em] font-bold">
                ELIGIBLE PRIVILEGES
              </span>
              <h2 className="font-heading font-black text-3xl text-white uppercase tracking-tight mt-1">
                Available Rewards
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((rew) => (
                <div
                  key={rew.id}
                  className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-green/60 transition-all shadow-neon-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/40 text-xs font-mono font-bold">
                        {rew.requiredStamps} Stamps Required
                      </span>
                      <Gift className="w-5 h-5 text-brand-green" />
                    </div>

                    <h3 className="font-heading font-black text-lg text-white mb-2">
                      {rew.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {rew.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>Valid {rew.validDays} Days</span>
                    <span className="text-brand-green font-bold">WALESS EXCLUSIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions Section */}
        {config?.termsConditions && (
          <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-brand-green" />
              <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider">
                Loyalty Terms & Conditions
              </h3>
            </div>
            <div className="text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-line">
              {config.termsConditions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoyaltyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white pt-32 flex items-center justify-center">
          <div className="text-brand-green font-mono text-xs">Loading Loyalty Club...</div>
        </div>
      }
    >
      <LoyaltyContent />
    </Suspense>
  );
}

