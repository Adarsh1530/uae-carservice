'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Instagram, Calendar, MessageCircle, Navigation, ExternalLink, Mail, Clock } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { BookingModal } from '@/components/modals/BookingModal';
import { BookingConfirmationModal } from '@/components/modals/BookingConfirmationModal';
import { SiteSettings, ServiceItem } from '@/lib/types';

export default function ContactPage() {
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

  const primaryPhone = settings?.phone || '+971 7 222 868';
  const mobile1 = settings?.mobile1 || '+971 54 307 2733';
  const mobile2 = settings?.mobile2 || '+971 54 307 2711';
  const address = settings?.address || 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES';
  const instagram = settings?.instagram || '@waless_group';
  const whatsappNumber = settings?.whatsapp1 || '+971543072733';

  const mapLat = settings?.mapLatitude || 25.7533;
  const mapLng = settings?.mapLongitude || 55.9525;
  const mapZoom = settings?.mapZoom || 14;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapLat},${mapLng}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-green selection:text-black">
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Banner */}
        <section className="relative pt-36 pb-20 bg-brand-surface border-b border-brand-border/60 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
              DIRECT CONCIERGE
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
              GET IN TOUCH WITH <span className="text-brand-green">WALESS GROUP</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Visit our headquarters in Ras Al Khaimah, schedule a private consultation, or connect directly with our client executive team.
            </p>
          </div>
        </section>

        {/* Contact Info & Map Grid */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-brand-border shadow-neon-sm mb-6">
                  <Image
                    src={settings?.contactImageUrl || '/uploads/gallery__12_.jpg'}
                    alt="WALESS GROUP Contact Hub"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Address Card */}
                <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/15 border border-brand-green/40 flex items-center justify-center shrink-0 text-brand-green">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base">HEADQUARTERS ADDRESS</h3>
                      <p className="text-sm text-gray-300 mt-1 leading-snug">{address}</p>
                    </div>
                  </div>
                </div>

                {/* Telephone Card */}
                <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
                  <h3 className="font-heading font-bold text-white text-base border-l-2 border-brand-green pl-3">
                    TELEPHONE & MOBILE LINES
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-brand-border/60">
                      <span className="text-xs text-brand-muted font-mono">PRIMARY TEL:</span>
                      <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="font-semibold text-white hover:text-brand-green">
                        {primaryPhone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-brand-border/60">
                      <span className="text-xs text-brand-muted font-mono">MOBILE LINE 1:</span>
                      <a href={`tel:${mobile1.replace(/\s+/g, '')}`} className="font-semibold text-white hover:text-brand-green">
                        {mobile1}
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-brand-border/60">
                      <span className="text-xs text-brand-muted font-mono">MOBILE LINE 2:</span>
                      <a href={`tel:${mobile2.replace(/\s+/g, '')}`} className="font-semibold text-white hover:text-brand-green">
                        {mobile2}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social & Hours */}
                <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-brand-muted">INSTAGRAM:</span>
                    <a
                      href={`https://instagram.com/${instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>{instagram}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs font-mono text-brand-muted">HOURS:</span>
                    <span className="text-xs text-gray-300 font-semibold">Sat - Thu: 9:00 AM - 9:00 PM</span>
                  </div>
                </div>

                {/* Quick CTAs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black border border-brand-border text-white hover:border-brand-green hover:text-brand-green font-heading font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <Phone className="w-4 h-4 text-brand-green" />
                    <span>CALL NOW</span>
                  </a>

                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-neon-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WHATSAPP</span>
                  </a>
                </div>
              </div>

              {/* Right Interactive Map Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-extrabold text-2xl text-white">
                    LOCATION MAP
                  </h2>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-green/40 text-brand-green font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-green hover:text-black transition-all shadow-neon-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>VIEW ON MAP</span>
                  </a>
                </div>

                <InteractiveMap
                  latitude={mapLat}
                  longitude={mapLng}
                  zoom={mapZoom}
                  address={address}
                />

                <div className="p-8 rounded-2xl bg-brand-surface border border-brand-green/30 shadow-neon-md space-y-4">
                  <h3 className="font-heading font-bold text-xl text-white">
                    Schedule Your Visit or Vehicle Transport
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    WALESS GROUP offers enclosed flatbed vehicle collection and delivery services across Ras Al Khaimah, Dubai, Abu Dhabi, and all northern Emirates.
                  </p>
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOK AN APPOINTMENT</span>
                  </button>
                </div>
              </div>
            </div>
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
        whatsappNumber={whatsappNumber}
        onClose={() => setConfirmedBooking(null)}
      />
    </div>
  );
}
