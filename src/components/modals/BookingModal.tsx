'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MapPin, Phone, FileText, Loader2, Sparkles } from 'lucide-react';
import { ServiceItem } from '@/lib/types';

interface BookingModalProps {
  isOpen: boolean;
  selectedService: ServiceItem | null;
  servicesList?: ServiceItem[];
  onClose: () => void;
  onSuccess: (bookingData: {
    referenceId: string;
    serviceName: string;
    fullName: string;
    address: string;
    phone: string;
    requestedDate: string;
    description?: string;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  selectedService,
  servicesList = [],
  onClose,
  onSuccess,
}) => {
  const [serviceId, setServiceId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Minimum date string for input (today)
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedService) {
      setServiceId(selectedService.id);
      setServiceName(selectedService.name);
    } else if (servicesList.length > 0) {
      setServiceId(servicesList[0].id);
      setServiceName(servicesList[0].name);
    }
  }, [selectedService, servicesList]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !address.trim() || !phone.trim() || !requestedDate) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          serviceName,
          fullName,
          address,
          phone,
          requestedDate,
          description,
        }),
      });

      const data = await res.json();

      if (data.success && data.booking) {
        onSuccess({
          referenceId: data.booking.referenceId,
          serviceName: data.booking.serviceName,
          fullName: data.booking.fullName,
          address: data.booking.address,
          phone: data.booking.phone,
          requestedDate: data.booking.requestedDate,
          description: data.booking.description,
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit booking request.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMessage('Network error submitting booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !loading && onClose()}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-brand-surface border border-brand-green/50 rounded-2xl shadow-neon-lg overflow-hidden z-10 p-6 sm:p-8 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-[11px] font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                WALESS GROUP BOOKING
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-1">
                Book An Appointment
              </h2>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-full bg-black/60 border border-white/10 text-gray-400 hover:text-white hover:border-brand-green transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-brand-green mb-1.5">
                Selected Service
              </label>
              {servicesList.length > 0 ? (
                <select
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    const found = servicesList.find((s) => s.id === e.target.value);
                    if (found) setServiceName(found.name);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all"
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={serviceName}
                  className="w-full px-4 py-3 rounded-xl bg-black/80 border border-brand-border text-white text-sm font-semibold"
                />
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                Full Name <span className="text-brand-green">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sheikh Mohammed Al-Qasimi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                Address / Location <span className="text-brand-green">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Al Dhait South, Ras Al Khaimah"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                Phone Number <span className="text-brand-green">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
                <input
                  type="tel"
                  required
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                Requested Booking Date <span className="text-brand-green">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                Description & Custom Requirements
              </label>
              <p className="text-[11px] text-brand-muted mb-1.5">
                For any customization or special requirements, describe them here.
              </p>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-green" />
                <textarea
                  rows={3}
                  placeholder="Specify vehicle model, color preferences, performance specs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-brand-border text-white text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md hover:shadow-neon-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>SUBMIT BOOKING REQUEST</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
