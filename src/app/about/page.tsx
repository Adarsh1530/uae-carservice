'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Compass, HeartHandshake, ShieldCheck, Award, Wrench, Calendar, CheckCircle } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/modals/BookingModal';
import { BookingConfirmationModal } from '@/components/modals/BookingConfirmationModal';
import { SiteSettings, ServiceItem } from '@/lib/types';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    fetch('/api/site-settings')
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-green selection:text-black">
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Page Banner */}
        <section className="relative pt-36 pb-20 bg-brand-surface border-b border-brand-border/60 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
              WHO WE ARE
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight mt-4">
              ABOUT <span className="text-brand-green">WHALESS GROUP</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
              Ras Al Khaimah’s benchmark for bespoke luxury automobile transformation, performance tuning, and executive corporate consultancy.
            </p>
          </div>
        </section>

        {/* Company Overview & Main Image */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-brand-green/40 shadow-neon-md">
                  <Image
                    src={settings?.aboutImageUrl || '/uploads/gallery__1_.jpg'}
                    alt="WHALESS GROUP Facility"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-green border-l-2 border-brand-green pl-3">
                  OUR LEGACY & STANDARDS
                </span>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Pioneering Luxury & Engineering Excellence
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  WHALESS GROUP was established to serve the upper echelon of automotive enthusiasts and corporate clients across the UAE. We believe that true luxury lies in absolute personalization, where engineering precision meets handcrafted artistic distinction.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Operating out of Al Dhait South, Ras Al Khaimah, our facility is equipped with high-tech diagnostic suites, climate-controlled clean rooms for ceramic/PPF application, and bespoke upholstery studios.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Values */}
        <section className="py-20 bg-brand-surface border-y border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-black border border-brand-border hover:border-brand-green/50 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-green/15 border border-brand-green/40 flex items-center justify-center text-brand-green">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">Our Mission</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  To provide automobile owners and corporate clients in the UAE with unmatched bespoke vehicle customization, zero-compromise security protection, and technical mastery.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-black border border-brand-border hover:border-brand-green/50 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-green/15 border border-brand-green/40 flex items-center justify-center text-brand-green">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">Our Vision</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  To become the Middle East's most recognized signature brand for bespoke automotive luxury, performance tuning innovation, and elite vehicle armor integration.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-black border border-brand-border hover:border-brand-green/50 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-green/15 border border-brand-green/40 flex items-center justify-center text-brand-green">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">Our Core Values</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Confidentiality, engineering precision, aesthetic perfection, transparent client communication, and absolute dedication to client satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-black text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Experience the WHALESS GROUP Distinction
            </h2>
            <p className="text-gray-400 text-sm">
              Schedule a visit to our flagship center in Ras Al Khaimah or speak with our executive team today.
            </p>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK AN APPOINTMENT</span>
            </button>
          </div>
        </section>
      </main>

      <Footer onOpenBooking={() => setBookingModalOpen(true)} />

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
