'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, Calendar, Sparkles, CheckCircle2, Search } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlowBorder } from '@/components/ui/GlowBorder';
import { ServiceDetailModal } from '@/components/modals/ServiceDetailModal';
import { BookingModal } from '@/components/modals/BookingModal';
import { BookingConfirmationModal } from '@/components/modals/BookingConfirmationModal';
import { ServiceItem, SiteSettings } from '@/lib/types';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services);
      });

    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      });
  }, []);

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBooking = (svc?: ServiceItem) => {
    if (svc) setSelectedServiceForBooking(svc);
    else if (services.length > 0) setSelectedServiceForBooking(services[0]);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-green selection:text-black">
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* Banner */}
        <section className="relative pt-36 pb-20 bg-brand-surface border-b border-brand-border/60 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
              OUR CAPABILITIES
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
              SERVICES & <span className="text-brand-green">BESPOKE SOLUTIONS</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our master-level services designed for ultra-luxury automobiles, performance engineering, ceramic protection, and corporate VIP fleets.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-brand-green" />
                <input
                  type="text"
                  placeholder="Search services (e.g. Detailing, Tuning, Customization)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Catalog */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No services found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((svc) => (
                  <GlowBorder key={svc.id} className="h-full flex flex-col">
                    <div className="relative h-60 w-full overflow-hidden rounded-t-xl">
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

                        {/* Features preview */}
                        {svc.features && svc.features.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-brand-border/40 space-y-1.5">
                            {svc.features.slice(0, 3).map((f, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-300">
                                <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setActiveServiceModal(svc)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-brand-green transition-colors"
                        >
                          <Eye className="w-4 h-4 text-brand-green" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => handleOpenBooking(svc)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  </GlowBorder>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer onOpenBooking={() => handleOpenBooking()} />

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
