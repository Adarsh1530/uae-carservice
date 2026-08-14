'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageCircle, X, ShieldCheck } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';

interface BookingConfirmationModalProps {
  booking: {
    referenceId: string;
    serviceName: string;
    fullName: string;
    address: string;
    phone: string;
    requestedDate: string;
    description?: string;
  } | null;
  whatsappNumber?: string;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  whatsappNumber = '+971543072733',
  onClose,
}) => {
  if (!booking) return null;

  const whatsappLink = buildWhatsAppLink(whatsappNumber, booking);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-brand-surface border border-brand-green/60 rounded-2xl shadow-neon-xl overflow-hidden z-10 p-6 sm:p-8 text-center"
        >
          {/* Animated Icon */}
          <div className="w-16 h-16 rounded-full bg-brand-green/20 border border-brand-green flex items-center justify-center mx-auto mb-4 shadow-neon-md">
            <CheckCircle2 className="w-10 h-10 text-brand-green" />
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            THANK YOU FOR YOUR BOOKING
          </h2>

          <p className="text-gray-300 text-sm mt-2">
            Your booking request has been received successfully by <strong className="text-white">WALESS GROUP</strong>.
          </p>

          {/* Details Card */}
          <div className="my-6 p-5 rounded-xl bg-black/80 border border-brand-border text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-brand-muted">REFERENCE ID:</span>
              <span className="text-brand-green font-bold text-sm tracking-widest">{booking.referenceId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brand-muted">SERVICE:</span>
              <span className="text-white font-semibold">{booking.serviceName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brand-muted">CUSTOMER:</span>
              <span className="text-gray-200">{booking.fullName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brand-muted">REQUESTED DATE:</span>
              <span className="text-gray-200">{booking.requestedDate}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-brand-muted">STATUS:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40">
                PENDING
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Please confirm your booking details via WhatsApp for immediate processing with our client Concierge.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-neon-md transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>CONFIRM THROUGH WHATSAPP</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-green/50 text-gray-300 hover:text-white font-heading text-xs uppercase tracking-wider transition-all"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
