'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Gift,
  ArrowRight,
  Download,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlowBorder } from '@/components/ui/GlowBorder';
import { BookingModal } from '@/components/modals/BookingModal';
import { BookingConfirmationModal } from '@/components/modals/BookingConfirmationModal';
import { SiteSettings, ServiceItem } from '@/lib/types';

export default function LoyaltyPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Interactive Stamp Card State
  const [activeStamps, setActiveStamps] = useState<number>(2);

  useEffect(() => {
    fetch('/api/site-settings?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      });

    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services);
      });
  }, []);

  const companyName = settings?.companyName || 'WALESS GROUP';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-green selection:text-black">
      <Navbar settings={settings} onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative pt-36 pb-20 bg-brand-surface border-b border-brand-border/60 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-green/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface border border-brand-green/50 shadow-neon-sm">
              <Sparkles className="w-4 h-4 text-brand-green animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-brand-green uppercase">
                EXECUTIVE VIP REWARDS PROGRAM
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
              {companyName} <span className="text-brand-green">LOYALTY PASS</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Every service visit brings you closer to exclusive prestige treatments. Collect 4 digital stamps and unlock a complimentary executive detailing finish.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK A SERVICE VISIT</span>
              </button>

              <a
                href="/uploads/waless_loyalty_poster.jpg"
                download="WALESS_GROUP_Loyalty_Poster.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-black border border-brand-border text-white hover:border-brand-green hover:text-brand-green font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-brand-green" />
                <span>DOWNLOAD PROMO POSTER</span>
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Digital Stamp Card & Phone Mockup Showcase */}
        <section className="py-20 bg-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Interactive Digital Card */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-green border-l-2 border-brand-green pl-3">
                    INTERACTIVE STAMP PREVIEW
                  </span>
                  <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-2">
                    Digital Rewards Card
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Tap the stamps below to see how your card fills up as you visit our workshop:
                  </p>
                </div>

                {/* The Luxury Card Visual */}
                <GlowBorder className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-brand-surface to-neutral-950 border border-brand-green/40 shadow-neon-lg relative overflow-hidden">
                  {/* Carbon Fiber Background Effect */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-brand-green/40 flex items-center justify-center p-1 shadow-neon-sm">
                          <Image src="/icon.svg" alt="WALESS Logo" width={28} height={28} />
                        </div>
                        <div>
                          <span className="font-heading font-extrabold text-white text-base tracking-wider block">
                            WALESS <span className="text-brand-green">GROUP</span>
                          </span>
                          <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest">
                            VIP PASS • RAS AL KHAIMAH
                          </span>
                        </div>
                      </div>

                      <div className="px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/40 text-brand-green font-mono text-[10px] tracking-widest uppercase">
                        BUY 4 = 1 FREE
                      </div>
                    </div>

                    {/* Stamp Circles */}
                    <div className="py-4">
                      <span className="text-xs font-mono text-gray-400 block mb-3 uppercase tracking-wider">
                        Progress: {activeStamps} of 4 Stamps Collected
                      </span>

                      <div className="grid grid-cols-5 gap-2 sm:gap-4 items-center">
                        {[1, 2, 3, 4].map((num) => {
                          const isStamped = num <= activeStamps;
                          return (
                            <button
                              key={num}
                              onClick={() => setActiveStamps(num)}
                              className={`h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                                isStamped
                                  ? 'bg-brand-green/20 border-brand-green shadow-neon-md text-brand-green scale-105'
                                  : 'bg-black/60 border-neutral-800 text-gray-500 hover:border-brand-green/40 hover:text-white'
                              }`}
                            >
                              <span className="font-heading font-black text-lg sm:text-xl">
                                {isStamped ? '✓' : num}
                              </span>
                              <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">
                                Visit {num}
                              </span>
                            </button>
                          );
                        })}

                        {/* 5th Free Reward Slot */}
                        <div
                          className={`h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                            activeStamps >= 4
                              ? 'bg-brand-green text-black font-bold border-brand-green shadow-neon-lg animate-pulse'
                              : 'bg-emerald-950/20 border-brand-green/30 text-brand-green/60'
                          }`}
                        >
                          <Gift className="w-5 h-5 mb-0.5" />
                          <span className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-center leading-tight">
                            FREE REWARD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-brand-green" />
                        <span>Save to Apple Wallet & Google Wallet</span>
                      </div>
                      <span className="font-mono text-[11px] text-brand-green">
                        {activeStamps >= 4 ? '🎉 REWARD UNLOCKED!' : `${4 - activeStamps} more visits to reward`}
                      </span>
                    </div>
                  </div>
                </GlowBorder>

                {/* Wallet Buttons Mockup */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-brand-border flex items-center gap-3">
                    <span className="text-xl">🍏</span>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-mono">Available in</span>
                      <span className="text-xs font-bold text-white">Apple Wallet</span>
                    </div>
                  </div>

                  <div className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-brand-border flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-mono">Available in</span>
                      <span className="text-xs font-bold text-white">Google Wallet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Promotional Poster Preview */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-sm rounded-3xl p-2 bg-gradient-to-b from-brand-green/40 via-emerald-950/30 to-black shadow-neon-lg">
                  <div className="relative h-[520px] w-full rounded-2xl overflow-hidden border border-brand-green/30 bg-black">
                    <Image
                      src="/uploads/waless_loyalty_poster.jpg"
                      alt="WALESS GROUP Loyalty Poster"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <a
                        href="/uploads/waless_loyalty_poster.jpg"
                        download="WALESS_GROUP_Loyalty_Poster.jpg"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider shadow-neon-sm hover:bg-brand-greenLight transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Poster (HD)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="py-20 bg-brand-surface border-y border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
                SIMPLE 4-STEP REWARDS
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                How The Loyalty Program Works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Book a Service',
                  desc: 'Bring your vehicle for any customization, detailing, tuning, or maintenance service.',
                },
                {
                  step: '02',
                  title: 'Collect Digital Stamp',
                  desc: 'Our technician stamps your digital Apple Wallet pass or loyalty card upon service completion.',
                },
                {
                  step: '03',
                  title: 'Gather 4 Stamps',
                  desc: 'Each visit adds 1 official stamp. Track your real-time progress right on your phone.',
                },
                {
                  step: '04',
                  title: 'Enjoy Free Treat',
                  desc: 'After 4 stamps, your 5th visit includes a complimentary bespoke polish or ceramic wash treat!',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-black border border-brand-border hover:border-brand-green/50 transition-all duration-300 space-y-3 relative group"
                >
                  <span className="font-heading font-black text-3xl text-brand-green/40 group-hover:text-brand-green transition-colors">
                    {item.step}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-green transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIP Benefits & Guarantee */}
        <section className="py-20 bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Why Join The {companyName} VIP Circle?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  icon: Award,
                  title: 'Priority Workshop Booking',
                  desc: 'Jump ahead in scheduling during peak seasons and get guaranteed priority slots for emergency maintenance.',
                },
                {
                  icon: Gift,
                  title: 'Bespoke Upgrade Treats',
                  desc: 'Receive free interior conditioning, leather ceramic treatments, and tire dressing upgrades with every visit.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Confidential Vehicle History',
                  desc: 'All customization and service logs securely maintained for collector cars, supercars, and corporate fleets.',
                },
              ].map((b, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/15 border border-brand-green/40 flex items-center justify-center text-brand-green">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">{b.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="px-8 py-4 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md transition-all inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK YOUR NEXT VISIT & GET STAMPED</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} onOpenBooking={() => setBookingModalOpen(true)} />

      <BookingModal
        isOpen={bookingModalOpen}
        selectedService={null}
        servicesList={services}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={(bData) => {
          setBookingModalOpen(false);
          setConfirmedBooking(bData);
        }}
      />

      <BookingConfirmationModal
        booking={confirmedBooking}
        whatsappNumber={settings?.whatsapp1 || '+971543072733'}
        onClose={() => setConfirmedBooking(null)}
      />
    </div>
  );
}
