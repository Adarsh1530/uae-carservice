'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Image as ImageIcon,
  FolderOpen,
  ArrowUpRight,
  ShieldCheck,
  Bell,
  Check,
  X,
  Eye,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { BookingItem } from '@/lib/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setRecentBookings(data.recentBookings || []);
          setRecentLogs(data.recentLogs || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-mono text-sm">
        Loading Admin Dashboard Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-mono font-bold border border-brand-green/40">
              SYSTEM ONLINE
            </span>
            <span className="text-xs font-mono text-gray-400">Asia/Dubai (UAE)</span>
          </div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-2">
            Executive Dashboard
          </h1>
        </div>

        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Manage Bookings ({stats?.pendingBookings || 0} Pending)</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Bookings */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-green/50 shadow-neon-sm relative overflow-hidden group">
          {stats?.pendingBookings > 0 && (
            <span className="absolute top-3 right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          )}
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Pending Bookings</span>
          </div>
          <div className="font-heading font-black text-4xl text-white">
            {stats?.pendingBookings || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Requires review and confirmation</p>
        </div>

        {/* Accepted Bookings */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Accepted Bookings</span>
          </div>
          <div className="font-heading font-black text-4xl text-white">
            {stats?.acceptedBookings || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Confirmed appointments</p>
        </div>

        {/* Rejected Bookings */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <XCircle className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Rejected Bookings</span>
          </div>
          <div className="font-heading font-black text-4xl text-white">
            {stats?.rejectedBookings || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Declined requests</p>
        </div>

        {/* Services & Media */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden">
          <div className="flex items-center gap-3 text-brand-green mb-2">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Services Catalog</span>
          </div>
          <div className="font-heading font-black text-4xl text-white">
            {stats?.totalServices || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">{stats?.totalGallery || 0} Gallery showcase images</p>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-white border-l-2 border-brand-green pl-3">
            Recent Booking Requests
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs text-brand-green hover:underline font-mono font-semibold"
          >
            View All ({stats?.totalBookings || 0}) ↗
          </Link>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-neon-sm">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No bookings recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/80 border-b border-brand-border text-brand-muted font-mono uppercase">
                  <tr>
                    <th className="p-4">Reference ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Requested Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 text-gray-300">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-green">{b.referenceId}</td>
                      <td className="p-4 font-semibold text-white">{b.fullName}</td>
                      <td className="p-4 text-gray-300">{b.serviceName}</td>
                      <td className="p-4 font-mono">{b.phone}</td>
                      <td className="p-4">{b.requestedDate}</td>
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
                      <td className="p-4 text-right">
                        <Link
                          href="/admin/bookings"
                          className="inline-flex items-center gap-1 text-xs text-brand-green hover:underline font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Activity */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-white border-l-2 border-brand-green pl-3">
          System Audit Stream
        </h2>
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-3 font-mono text-xs text-gray-400">
          {recentLogs.length === 0 ? (
            <div>No activity recorded yet.</div>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between border-b border-white/5 pb-2">
                <div className="space-x-2">
                  <span className="text-brand-green font-bold">[{log.adminUsername}]</span>
                  <span className="text-white">{log.action}</span>
                  <span className="text-gray-500">({log.entityType})</span>
                </div>
                <span className="text-gray-500">{formatDate(log.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
