'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Wrench,
  CheckCircle,
  Eye,
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlowBorder } from '@/components/ui/GlowBorder';
import { ServiceDetailModal } from '@/components/modals/ServiceDetailModal';
import { BookingModal } from '@/components/modals/BookingModal';
import { BookingConfirmationModal } from '@/components/modals/BookingConfirmationModal';
import { SiteSettings, ServiceItem, GalleryItem } from '@/lib/types';

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Modals state
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    // Fetch Settings
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      });

    // Fetch Services
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services);
      });

    // Fetch Featured Gallery
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGallery(data.gallery.slice(0, 6));
      });
  }, []);

  const handleOpenBooking = (service?: ServiceItem) => {
    if (service) setSelectedServiceForBooking(service);
    else if (services.length > 0) setSelectedServiceForBooking(services[0]);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-green selection:text-black">
      {/* Navigation Header */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-black">
          {/* Ambient Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Heading & Copy */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-green/40 shadow-neon-sm">
                  <Sparkles className="w-4 h-4 text-brand-green animate-pulse" />
                  <span className="text-xs font-mono tracking-widest text-brand-green uppercase">
                    ULTRA-LUXURY AUTOMOTIVE & EXECUTIVE SOLUTIONS
                  </span>
                </div>

                <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                  {settings?.heroHeading || (
                    <>
                      ELEVATING <span className="green-gradient-text">AUTOMOTIVE & CORPORATE</span> EXCELLENCE
                    </>
                  )}
                </h1>

                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {settings?.heroSubheading ||
                    'WHALESS GROUP delivers ultra-luxury bespoke vehicle customization, high-performance tuning, and elite corporate services across Ras Al Khaimah and the UAE.'}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                    href="/services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-surface border border-brand-green text-brand-green font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-green hover:text-black shadow-neon-sm hover:shadow-neon-md transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>EXPLORE SERVICES</span>
                  </Link>

                  <button
                    onClick={() => handleOpenBooking()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md hover:shadow-neon-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOK AN APPOINTMENT</span>
                  </button>
                </div>

                {/* Badges */}
                <div className="pt-8 grid grid-cols-3 gap-4 border-t border-brand-border/60 max-w-lg mx-auto lg:mx-0 text-left">
                  <div>
                    <span className="font-heading font-extrabold text-white text-xl block">100%</span>
                    <span className="text-[11px] text-brand-muted uppercase font-mono">Bespoke Finish</span>
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-white text-xl block">RAK • UAE</span>
                    <span className="text-[11px] text-brand-muted uppercase font-mono">Flagship Hub</span>
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-white text-xl block">VIP</span>
                    <span className="text-[11px] text-brand-muted uppercase font-mono">Concierge Service</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Hero Image Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                <div className="relative mx-auto max-w-lg rounded-2xl p-2 bg-gradient-to-br from-brand-green/40 via-emerald-900/20 to-transparent shadow-neon-lg">
                  <div className="relative h-[380px] sm:h-[450px] w-full rounded-xl overflow-hidden border border-brand-border bg-brand-surface">
                    <Image
                      src={settings?.heroImageUrl || '/uploads/home_page.jpg'}
                      alt="WHALESS GROUP Flagship Automobile"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-brand-green/30">
                      <span className="text-[10px] font-mono text-brand-green tracking-widest uppercase block">
                        <span className="text-brand-green">WALESS GROUP</span> UAE
                      </span>
                      <h3 className="font-heading font-bold text-white text-sm">
                        Mastery in Automobile Artistry
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= COMPANY INTRODUCTION ================= */}
        <section className="py-20 bg-brand-surface border-y border-brand-border/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <div className="relative h-96 sm:h-[450px] w-full rounded-2xl overflow-hidden border border-brand-border shadow-neon-sm">
                  <Image
                    src={settings?.aboutImageUrl || '/uploads/gallery__1_.jpg'}
                    alt="WALESS GROUP Headquarters"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent" />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-green border-l-2 border-brand-green pl-3">
                  ABOUT WALESS GROUP
                </span>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Crafting Extraordinary Automotive Standard in Ras Al Khaimah
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  WALESS GROUP stands as Ras Al Khaimah’s premier house for automotive refinement and executive solutions. Founded on principles of precision engineering, uncompromising quality, and stealth luxury aesthetics, we cater to discerning automobile owners, collectors, and corporate enterprises across the United Arab Emirates.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    'Master Craftsmanship & Certified Technicians',
                    'State-of-the-Art Diagnostic & Tuning Facility',
                    'Hand-Selected Premium Materials & Global Sourcing',
                    'Bespoke VIP Client Concierge & Transport',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-green shrink-0" />
                      <span className="text-sm font-medium text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-brand-green hover:text-white transition-colors"
                  >
                    <span>Read Full Company Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES PREVIEW ================= */}
        <section className="py-24 bg-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
                EXECUTIVE CAPABILITIES
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
                Our Signature Services
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Discover our comprehensive range of specialized automotive customization, protection, and performance engineering solutions.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((svc) => (
                <GlowBorder key={svc.id} className="h-full flex flex-col">
                  <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
                    <Image
                      src={svc.mainImage}
                      alt={svc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-heading font-bold text-xl text-white group-hover:text-brand-green transition-colors">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">
                        {svc.shortDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveServiceModal(svc)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-brand-green transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-green" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleOpenBooking(svc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green text-black font-heading font-bold text-[11px] uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                </GlowBorder>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-surface border border-brand-border text-white font-heading font-bold text-xs uppercase tracking-wider hover:border-brand-green hover:text-brand-green transition-all"
              >
                <span>View Full Service Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FEATURED GALLERY ================= */}
        <section className="py-24 bg-brand-surface border-t border-brand-border/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-green border-l-2 border-brand-green pl-3">
                  WORKSHOP SHOWCASE
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mt-2">
                  Recent Projects & Deliveries
                </h2>
              </div>

              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-brand-green hover:text-white transition-colors"
              >
                <span>Explore Full Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <Link
                  key={item.id}
                  href="/gallery"
                  className="group relative h-64 rounded-xl overflow-hidden border border-brand-border hover:border-brand-green/60 shadow-neon-sm transition-all duration-300"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[10px] font-mono text-brand-green uppercase tracking-widest block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-heading font-bold text-white text-sm group-hover:text-brand-green transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="py-24 bg-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
                THE WHALESS ADVANTAGE
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
                Why Clients Trust WALESS GROUP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Unrivaled Security & Privacy',
                  desc: 'Complete confidentiality for high-profile clients, dignitaries, and collectors. Secured workshop environment with 24/7 monitoring.',
                },
                {
                  icon: Award,
                  title: 'Master Precision Engineering',
                  desc: 'Factory-grade diagnostic equipment, European trained technicians, and certified installation standards for exotic and luxury vehicles.',
                },
                {
                  icon: Layers,
                  title: 'Bespoke Customization',
                  desc: 'Zero generic templates. Every material, stitch, carbon weave, and ECU software parameter is customized strictly to your specifications.',
                },
              ].map((strength, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-green/50 transition-all duration-300 space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-green/15 border border-brand-green/40 flex items-center justify-center group-hover:bg-brand-green group-hover:text-black transition-colors duration-300 text-brand-green">
                    <strength.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-brand-green transition-colors">
                    {strength.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{strength.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-r from-brand-surface via-emerald-950/30 to-brand-surface border-y border-brand-green/30">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
              READY TO ELEVATE YOUR VEHICLE?
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Schedule Your Private Consultation Today
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Our specialists in Ras Al Khaimah are standing by to discuss your automobile customization or corporate fleet requirements.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md hover:shadow-neon-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK APPOINTMENT</span>
              </button>
              <a
                href="tel:+9717222868"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-black border border-brand-border text-white font-heading font-bold text-xs uppercase tracking-wider hover:border-brand-green hover:text-brand-green transition-all"
              >
                <Phone className="w-4 h-4 text-brand-green" />
                <span>CALL +971 7 222 868</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Modals */}
      <ServiceDetailModal
        service={activeServiceModal}
        onClose={() => setActiveServiceModal(null)}
        onBook={(svc) => handleOpenBooking(svc)}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        selectedService={selectedServiceForBooking}
        servicesList={services}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={(bookingData) => {
          setBookingModalOpen(false);
          setConfirmedBooking(bookingData);
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
