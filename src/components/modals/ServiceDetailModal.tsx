'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceItem } from '@/lib/types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-3xl bg-brand-surface border border-brand-green/40 rounded-2xl shadow-neon-lg overflow-hidden z-10 my-8"
        >
          {/* Header Bar */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <Image
              src={service.mainImage}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:text-brand-green hover:border-brand-green transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/50 text-brand-green font-mono text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                WHALESS GROUP SERVICE
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                {service.name}
              </h2>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xs uppercase font-mono tracking-widest text-brand-green mb-2">
                Overview
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {service.detailedDesc}
              </p>
            </div>

            {/* Features List */}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-xs uppercase font-mono tracking-widest text-brand-green mb-3">
                  Service Highlights & Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-black/60 border border-brand-border/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Images Grid */}
            {service.additionalImages && service.additionalImages.length > 0 && (
              <div>
                <h3 className="text-xs uppercase font-mono tracking-widest text-brand-green mb-3">
                  Gallery Showcase
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {service.additionalImages.map((img, idx) => (
                    <div key={idx} className="relative h-32 rounded-lg overflow-hidden border border-brand-border">
                      <Image src={img} alt={`Showcase ${idx}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-brand-muted block">Pricing Model</span>
                <span className="text-sm font-semibold text-white">
                  {service.priceInfo || 'Bespoke Quote Upon Request'}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onBook(service);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md hover:shadow-neon-lg transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book An Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
