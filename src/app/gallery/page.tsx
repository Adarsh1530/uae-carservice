'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles, Maximize2, Tag } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GalleryLightboxModal } from '@/components/modals/GalleryLightboxModal';
import { BookingModal } from '@/components/modals/BookingModal';
import { BookingConfirmationModal } from '@/components/modals/BookingConfirmationModal';
import { GalleryItem, SiteSettings, ServiceItem } from '@/lib/types';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGallery(data.gallery);
      });

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

  const categories = ['All', 'Luxury Customization', 'Detailing & PPF', 'Performance Tuning', 'VIP Cabin', 'Corporate'];

  const filteredGallery =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-green selection:text-black">
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Banner */}
        <section className="relative pt-36 pb-20 bg-brand-surface border-b border-brand-border/60 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-green px-3.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
              WORKSHOP PORTFOLIO
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
              PROJECT <span className="text-brand-green">GALLERY</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Browse our portfolio of completed supercars, bespoke interiors, ceramic armor protection, and executive fleet builds.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-heading uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-brand-green text-black font-bold shadow-neon-sm'
                      : 'bg-black border border-brand-border text-gray-400 hover:text-white hover:border-brand-green/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredGallery.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No items available under category &quot;{selectedCategory}&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative h-72 rounded-xl overflow-hidden border border-brand-border hover:border-brand-green/70 shadow-neon-sm transition-all duration-500 cursor-pointer"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                    {/* Expand Icon */}
                    <div className="absolute top-4 right-4 p-2 rounded-full bg-black/70 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-neon-sm">
                      <Maximize2 className="w-4 h-4 text-brand-green" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-brand-green uppercase tracking-widest block mb-1">
                        <Tag className="w-3 h-3" />
                        {item.category}
                      </span>
                      <h3 className="font-heading font-bold text-white text-base group-hover:text-brand-green transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer onOpenBooking={() => setBookingModalOpen(true)} />

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        items={filteredGallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

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
