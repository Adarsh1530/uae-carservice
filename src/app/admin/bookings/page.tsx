'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  ExternalLink,
  Settings,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { formatDate, buildAcceptWhatsAppUrl, buildRejectWhatsAppUrl } from '@/lib/utils';
import { BookingItem } from '@/lib/types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<BookingItem | null>(null);
  const [manageBooking, setManageBooking] = useState<BookingItem | null>(null);
  const [deleteTargetBooking, setDeleteTargetBooking] = useState<BookingItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // WhatsApp notification popup modal
  const [whatsappNotifyModal, setWhatsappNotifyModal] = useState<{
    type: 'ACCEPT' | 'REJECT';
    booking: BookingItem;
    whatsappUrl: string;
  } | null>(null);

  const fetchBookings = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      status: statusFilter,
      search: searchQuery,
    });

    fetch(`/api/bookings?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings || []);
          if (data.pagination) setPagination(data.pagination);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(1);
  };

  const handleAcceptStatus = async (targetBooking: BookingItem) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetBooking.id,
          action: 'ACCEPT',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setManageBooking(null);
        fetchBookings(pagination.page);

        const waUrl = buildAcceptWhatsAppUrl({
          fullName: targetBooking.fullName,
          phone: targetBooking.phone,
          serviceName: targetBooking.serviceName,
          referenceId: targetBooking.referenceId,
          requestedDate: targetBooking.requestedDate,
          address: targetBooking.address,
        });

        setWhatsappNotifyModal({
          type: 'ACCEPT',
          booking: targetBooking,
          whatsappUrl: waUrl,
        });
      } else {
        alert(data.error || 'Failed to accept booking');
      }
    } catch (e) {
      console.error('Accept booking error:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectStatus = async (targetBooking: BookingItem, reason: string) => {
    if (!reason.trim()) {
      alert('Please state a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetBooking.id,
          action: 'REJECT',
          rejectionReason: reason.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setManageBooking(null);
        setRejectionReason('');
        fetchBookings(pagination.page);

        const waUrl = buildRejectWhatsAppUrl({
          fullName: targetBooking.fullName,
          phone: targetBooking.phone,
          serviceName: targetBooking.serviceName,
          referenceId: targetBooking.referenceId,
          requestedDate: targetBooking.requestedDate,
        });

        setWhatsappNotifyModal({
          type: 'REJECT',
          booking: targetBooking,
          whatsappUrl: waUrl,
        });
      } else {
        alert(data.error || 'Failed to reject booking');
      }
    } catch (e) {
      console.error('Reject booking error:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetPendingStatus = async (targetBooking: BookingItem) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetBooking.id,
          action: 'PENDING',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setManageBooking(null);
        fetchBookings(pagination.page);
      } else {
        alert(data.error || 'Failed to update booking');
      }
    } catch (e) {
      console.error('Update status error:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetBooking) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings?id=${deleteTargetBooking.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setDeleteTargetBooking(null);
        fetchBookings(pagination.page);
      } else {
        alert(data.error || 'Failed to delete booking');
      }
    } catch (e) {
      console.error('Delete booking error:', e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
            CLIENT REQUESTS
          </span>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-1">
            Bookings Management
          </h1>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-brand-surface p-4 rounded-2xl border border-brand-border">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-brand-green text-black shadow-neon-sm'
                  : 'bg-black/60 text-gray-400 hover:text-white border border-brand-border/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full lg:w-80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reference ID, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-green text-brand-green text-xs font-heading font-bold hover:bg-brand-green hover:text-black transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-neon-sm">
        {loading ? (
          <div className="p-16 text-center text-gray-500 font-mono text-sm">
            Fetching Booking Records...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-sm">
            No booking records found for selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/90 border-b border-brand-border text-brand-muted font-mono uppercase">
                <tr>
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-gray-300">
                {bookings.map((b) => {
                  const waUrl =
                    b.status === 'ACCEPTED'
                      ? buildAcceptWhatsAppUrl(b)
                      : buildRejectWhatsAppUrl(b);

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-green">{b.referenceId}</td>
                      <td className="p-4 font-semibold text-white">{b.fullName}</td>
                      <td className="p-4 text-gray-300">{b.serviceName}</td>
                      <td className="p-4 font-mono">{b.phone}</td>
                      <td className="p-4">{b.requestedDate}</td>
                      <td className="p-4 text-gray-500">{formatDate(b.createdAt)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            b.status === 'ACCEPTED'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                              : b.status === 'REJECTED'
                              ? 'bg-red-950/60 text-red-400 border-red-500/40'
                              : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {/* 1. View Details Icon */}
                        <button
                          onClick={() => setSelectedBookingDetails(b)}
                          className="p-1.5 rounded-lg bg-black border border-brand-border text-gray-300 hover:text-white hover:border-brand-green transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4 text-brand-green" />
                        </button>

                        {/* 2. WhatsApp Notification Icon */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-800/80 transition-colors"
                          title="Send WhatsApp Notification to Customer"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                        </a>

                        {/* 3. Manage Status Icon */}
                        <button
                          onClick={() => {
                            setManageBooking(b);
                            setRejectionReason(b.rejectionReason || '');
                          }}
                          className="p-1.5 rounded-lg bg-black border border-brand-border text-gray-300 hover:text-brand-green transition-colors"
                          title="Manage Status (Accept / Reject / Pending)"
                        >
                          <Settings className="w-4 h-4 text-amber-400" />
                        </button>

                        {/* 4. Delete Booking Icon */}
                        <button
                          onClick={() => setDeleteTargetBooking(b)}
                          className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 transition-colors"
                          title="Delete Booking Request"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Server Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-gray-400 bg-black/60">
            <span>
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} Total Records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchBookings(pagination.page - 1)}
                className="p-2 rounded-lg bg-brand-surface border border-brand-border text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchBookings(pagination.page + 1)}
                className="p-2 rounded-lg bg-brand-surface border border-brand-border text-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-brand-surface border border-brand-green/40 rounded-2xl p-6 space-y-4 relative shadow-neon-lg">
            <button
              onClick={() => setSelectedBookingDetails(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-brand-border pb-3">
              <span className="text-xs font-mono text-brand-green uppercase">BOOKING DETAILS</span>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                {selectedBookingDetails.referenceId}
              </h3>
            </div>

            <div className="space-y-2 text-xs text-gray-300 font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-brand-muted">CUSTOMER:</span>
                <span className="text-white font-semibold">{selectedBookingDetails.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-brand-muted">SERVICE:</span>
                <span className="text-white">{selectedBookingDetails.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-brand-muted">PHONE:</span>
                <span className="text-brand-green">{selectedBookingDetails.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-brand-muted">ADDRESS:</span>
                <span className="text-white text-right max-w-xs">{selectedBookingDetails.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-brand-muted">REQUESTED DATE:</span>
                <span className="text-white">{selectedBookingDetails.requestedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-brand-muted">STATUS:</span>
                <span className="text-amber-400 font-bold">{selectedBookingDetails.status}</span>
              </div>

              {selectedBookingDetails.description && (
                <div className="pt-2">
                  <span className="text-brand-muted block mb-1">DESCRIPTION / CUSTOM REQUIREMENTS:</span>
                  <p className="p-3 rounded-lg bg-black border border-brand-border text-gray-200 font-sans leading-relaxed">
                    {selectedBookingDetails.description}
                  </p>
                </div>
              )}

              {selectedBookingDetails.rejectionReason && (
                <div className="pt-2">
                  <span className="text-red-400 font-bold block mb-1">REJECTION REASON:</span>
                  <p className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 font-sans">
                    {selectedBookingDetails.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-heading"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE BOOKING MODAL (Accept / Reject / Reset Status) */}
      {manageBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-brand-surface border border-brand-green/40 rounded-2xl p-6 sm:p-8 space-y-5 relative shadow-neon-xl">
            <button
              onClick={() => setManageBooking(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-brand-border pb-3">
              <span className="text-xs font-mono text-brand-green uppercase">MANAGE BOOKING STATUS</span>
              <h2 className="font-heading font-extrabold text-xl text-white">
                {manageBooking.referenceId} — {manageBooking.fullName}
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Current Status: <strong className="text-brand-green">{manageBooking.status}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAcceptStatus(manageBooking)}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ACCEPT BOOKING</span>
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleSetPendingStatus(manageBooking)}
                  className="py-3 px-4 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>RESET TO PENDING</span>
                </button>
              </div>

              <div className="border-t border-brand-border/60 pt-4 space-y-2">
                <label className="block text-xs font-mono uppercase text-red-300">
                  Rejection Reason (if rejecting request)
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleRejectStatus(manageBooking, rejectionReason)}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT BOOKING</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setManageBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-heading"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE BOOKING CONFIRMATION MODAL */}
      {deleteTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-surface border border-red-500/50 rounded-2xl p-6 text-center space-y-4 shadow-neon-lg">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            <h3 className="font-heading font-extrabold text-xl text-white">DELETE BOOKING?</h3>

            <p className="text-xs text-gray-300">
              Are you sure you want to permanently delete booking <strong className="text-red-400">{deleteTargetBooking.referenceId}</strong> ({deleteTargetBooking.fullName})? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetBooking(null)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-black border border-brand-border text-white text-xs font-heading hover:bg-white/10"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-heading font-bold shadow-neon-sm"
              >
                {actionLoading ? 'DELETING...' : 'DELETE BOOKING'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Action Notification Modal */}
      {whatsappNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-brand-surface border border-emerald-500/60 rounded-2xl p-6 space-y-4 text-center shadow-neon-xl relative">
            <button
              onClick={() => setWhatsappNotifyModal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <MessageSquare className="w-7 h-7" />
            </div>

            <h3 className="font-heading font-extrabold text-xl text-white">
              {whatsappNotifyModal.type === 'ACCEPT' ? 'BOOKING ACCEPTED!' : 'BOOKING REJECTED'}
            </h3>

            <p className="text-xs text-gray-300">
              Status updated for <strong className="text-brand-green">{whatsappNotifyModal.booking.fullName}</strong> ({whatsappNotifyModal.booking.referenceId}). Click the button below to send the official WhatsApp message to the customer.
            </p>

            <div className="p-4 rounded-xl bg-black/90 border border-brand-border text-left space-y-2">
              <span className="text-[10px] font-mono uppercase text-brand-green block font-bold">
                WhatsApp Message Template:
              </span>
              <p className="text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                {whatsappNotifyModal.type === 'ACCEPT'
                  ? `Hello ${whatsappNotifyModal.booking.fullName},
Your booking request for ${whatsappNotifyModal.booking.serviceName} has been accepted successfully.
Reference Number: ${whatsappNotifyModal.booking.referenceId}
Date: ${whatsappNotifyModal.booking.requestedDate}
Time: 10:00 AM
Location: ${whatsappNotifyModal.booking.address || 'AL DHAIT SOUTH, RAS AL KHAIMAH, UAE'}

Thank you for choosing WALESS GROUP. We look forward to serving you!`
                  : `Hello ${whatsappNotifyModal.booking.fullName},
We regret to inform you that your booking request for ${whatsappNotifyModal.booking.serviceName} and ${whatsappNotifyModal.booking.referenceId} on ${whatsappNotifyModal.booking.requestedDate} at 10:00 AM has been rejected.

Please contact us or submit another booking request for an alternative date and time.

Thank you for understanding.
WALESS GROUP`}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setWhatsappNotifyModal(null)}
                className="flex-1 py-3 rounded-xl bg-black border border-brand-border text-white text-xs font-heading"
              >
                Close
              </button>
              <a
                href={whatsappNotifyModal.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWhatsappNotifyModal(null)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-heading font-bold text-xs uppercase tracking-wider shadow-neon-md cursor-pointer transition-all"
              >
                <span>OPEN WHATSAPP NOW</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
