'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Award,
  Search,
  QrCode,
  Users,
  Gift,
  History,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Share2,
  Calendar,
  Clock,
  Sparkles,
  Car,
  AlertCircle,
  Loader2,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  LoyaltyCustomerItem,
  LoyaltyConfig,
  LoyaltyRewardItem,
  LoyaltyTransactionItem,
  LoyaltyRedemptionItem,
} from '@/lib/types';
import { DigitalLoyaltyCard } from '@/components/loyalty/DigitalLoyaltyCard';

function AdminLoyaltyContent() {
  const searchParams = useSearchParams();
  const initialLookup = searchParams.get('lookup') || searchParams.get('scan') || '';

  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'customers' | 'rewards' | 'transactions' | 'settings'>('overview');

  // Dashboard Stats
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<LoyaltyConfig | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<LoyaltyTransactionItem[]>([]);
  const [recentRedemptions, setRecentRedemptions] = useState<LoyaltyRedemptionItem[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Terminal state
  const [terminalQuery, setTerminalQuery] = useState(initialLookup);
  const [terminalLoading, setTerminalLoading] = useState(false);
  const [terminalCustomer, setTerminalCustomer] = useState<any | null>(null);
  const [terminalServices, setTerminalServices] = useState<any[]>([]);
  const [terminalRewards, setTerminalRewards] = useState<any[]>([]);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [terminalSuccess, setTerminalSuccess] = useState<string | null>(null);

  // Fast Stamp Form
  const [selectedService, setSelectedService] = useState('');
  const [serviceReference, setServiceReference] = useState('');
  const [stampAmount, setStampAmount] = useState('1');
  const [stampNotes, setStampNotes] = useState('');
  const [stampProcessing, setStampProcessing] = useState(false);

  // Customer Management
  const [customers, setCustomers] = useState<LoyaltyCustomerItem[]>([]);
  const [customerPagination, setCustomerPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('ALL');
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<LoyaltyCustomerItem | null>(null);

  // Add/Edit Customer Modal
  const [customerModalMode, setCustomerModalMode] = useState<'add' | 'edit' | null>(null);
  const [customerFormData, setCustomerFormData] = useState({
    id: '',
    fullName: '',
    phone: '',
    email: '',
    plateNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    status: 'ACTIVE',
  });
  const [savingCustomer, setSavingCustomer] = useState(false);

  // Rewards Management
  const [rewardsList, setRewardsList] = useState<LoyaltyRewardItem[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [rewardFormData, setRewardFormData] = useState({
    id: '',
    title: '',
    description: '',
    requiredStamps: '4',
    requiredPoints: '0',
    validDays: '90',
    displayOrder: '0',
    isActive: true,
  });
  const [savingReward, setSavingReward] = useState(false);

  // Transactions Ledger
  const [transactions, setTransactions] = useState<LoyaltyTransactionItem[]>([]);
  const [txPagination, setTxPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [txTypeFilter, setTxTypeFilter] = useState('ALL');
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Settings State
  const [settingsFormData, setSettingsFormData] = useState({
    programName: '',
    programTagline: '',
    isActive: true,
    rewardMode: 'STAMPS',
    stampsPerReward: 4,
    stampsPerVisit: 1,
    rewardExpiryDays: 365,
    rewardTitle: '',
    rewardDescription: '',
    termsConditions: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Dashboard Data
  const fetchDashboardData = () => {
    setLoadingDashboard(true);
    fetch('/api/admin/loyalty/dashboard?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setConfig(data.config);
          setRecentTransactions(data.recentTransactions || []);
          setRecentRedemptions(data.recentRedemptions || []);
          if (data.config) {
            setSettingsFormData({
              programName: data.config.programName || '',
              programTagline: data.config.programTagline || '',
              isActive: data.config.isActive ?? true,
              rewardMode: data.config.rewardMode || 'STAMPS',
              stampsPerReward: data.config.stampsPerReward || 4,
              stampsPerVisit: data.config.stampsPerVisit || 1,
              rewardExpiryDays: data.config.rewardExpiryDays || 365,
              rewardTitle: data.config.rewardTitle || '',
              rewardDescription: data.config.rewardDescription || '',
              termsConditions: data.config.termsConditions || '',
            });
          }
        }
      })
      .catch((e) => console.error('Dashboard fetch error:', e))
      .finally(() => setLoadingDashboard(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // If scan/lookup provided in URL, switch to terminal tab and run search
  useEffect(() => {
    if (initialLookup && initialLookup.trim()) {
      setActiveTab('terminal');
      handleTerminalSearch(initialLookup.trim());
    }
  }, [initialLookup]);

  // Terminal Search
  const handleTerminalSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || terminalQuery).trim();
    if (!q) {
      setTerminalError('Please enter a Loyalty ID, Mobile Phone, Plate Number, or scan QR code.');
      return;
    }

    setTerminalLoading(true);
    setTerminalError(null);
    setTerminalSuccess(null);

    try {
      const res = await fetch('/api/admin/loyalty/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (data.success && data.customer) {
        setTerminalCustomer(data.customer);
        if (data.services) setTerminalServices(data.services);
        if (data.rewards) setTerminalRewards(data.rewards);
        if (data.config) setConfig(data.config);
        if (data.services && data.services.length > 0 && !selectedService) {
          setSelectedService(data.services[0].name);
        }
      } else {
        setTerminalCustomer(null);
        setTerminalError(data.error || 'No customer matching this code was found.');
      }
    } catch (err) {
      console.error(err);
      setTerminalError('Terminal network connection failed.');
    } finally {
      setTerminalLoading(false);
    }
  };

  // Stamp Action
  const handleAddStamp = async () => {
    if (!terminalCustomer) return;
    setStampProcessing(true);
    setTerminalError(null);
    setTerminalSuccess(null);

    try {
      const res = await fetch('/api/admin/loyalty/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: terminalCustomer.id,
          amount: parseInt(stampAmount, 10) || 1,
          serviceName: selectedService || 'Workshop Service',
          serviceReference: serviceReference.trim() || undefined,
          notes: stampNotes.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (data.success && data.customer) {
        setTerminalCustomer((prev: any) => ({
          ...prev,
          currentStamps: data.customer.currentStamps,
          lifetimeStamps: data.customer.lifetimeStamps,
        }));
        setTerminalSuccess(data.message || 'Service stamp successfully awarded!');
        setServiceReference('');
        setStampNotes('');
        fetchDashboardData();
      } else {
        setTerminalError(data.error || 'Failed to add stamp.');
      }
    } catch (err) {
      console.error(err);
      setTerminalError('Error awarding stamp.');
    } finally {
      setStampProcessing(false);
    }
  };

  // Reward Redemption Action
  const handleRedeemReward = async (rewardId?: string) => {
    if (!terminalCustomer) return;
    const confirmRedeem = window.confirm(
      `Confirm redemption for ${terminalCustomer.fullName}? This will deduct the required stamps and generate a unique redemption voucher.`
    );
    if (!confirmRedeem) return;

    setStampProcessing(true);
    setTerminalError(null);
    setTerminalSuccess(null);

    try {
      const res = await fetch('/api/admin/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: terminalCustomer.id,
          rewardId,
          serviceReference: serviceReference.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (data.success && data.customer) {
        setTerminalCustomer((prev: any) => ({
          ...prev,
          currentStamps: data.customer.currentStamps,
        }));
        setTerminalSuccess(data.message);
        fetchDashboardData();
      } else {
        setTerminalError(data.error || 'Redemption failed.');
      }
    } catch (err) {
      console.error(err);
      setTerminalError('Server error processing redemption.');
    } finally {
      setStampProcessing(false);
    }
  };

  // Customer Management Fetch
  const fetchCustomers = (page = 1) => {
    setLoadingCustomers(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '15',
      status: customerStatusFilter,
      search: customerSearch,
      _t: String(Date.now()),
    });

    fetch(`/api/admin/loyalty/customers?${params}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.customers || []);
          if (data.pagination) setCustomerPagination(data.pagination);
        }
      })
      .finally(() => setLoadingCustomers(false));
  };

  useEffect(() => {
    if (activeTab === 'customers') {
      fetchCustomers(1);
    }
  }, [activeTab, customerStatusFilter]);

  // Save Customer (Add / Edit)
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCustomer(true);

    try {
      const isEdit = customerModalMode === 'edit';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/loyalty/customers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerFormData),
      });
      const data = await res.json();

      if (data.success) {
        setCustomerModalMode(null);
        fetchCustomers(customerPagination.page);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save customer.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving customer.');
    } finally {
      setSavingCustomer(false);
    }
  };

  // Rewards Fetch
  const fetchRewards = () => {
    setLoadingRewards(true);
    fetch('/api/admin/loyalty/rewards?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRewardsList(data.rewards || []);
      })
      .finally(() => setLoadingRewards(false));
  };

  useEffect(() => {
    if (activeTab === 'rewards') fetchRewards();
  }, [activeTab]);

  const handleSaveReward = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingReward(true);

    try {
      const isEdit = Boolean(rewardFormData.id);
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/loyalty/rewards', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewardFormData),
      });
      const data = await res.json();

      if (data.success) {
        setRewardModalOpen(false);
        fetchRewards();
      } else {
        alert(data.error || 'Failed to save reward');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving reward');
    } finally {
      setSavingReward(false);
    }
  };

  // Transactions Fetch
  const fetchTransactions = (page = 1) => {
    setLoadingTransactions(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '25',
      type: txTypeFilter,
      _t: String(Date.now()),
    });

    fetch(`/api/admin/loyalty/transactions?${params}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions || []);
          if (data.pagination) setTxPagination(data.pagination);
        }
      })
      .finally(() => setLoadingTransactions(false));
  };

  useEffect(() => {
    if (activeTab === 'transactions') fetchTransactions(1);
  }, [activeTab, txTypeFilter]);

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      const res = await fetch('/api/admin/loyalty/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsFormData),
      });
      const data = await res.json();

      if (data.success) {
        setConfig(data.config);
        setSettingsMessage({ type: 'success', text: 'Loyalty program rules saved successfully!' });
      } else {
        setSettingsMessage({ type: 'error', text: data.error || 'Failed to save rules.' });
      }
    } catch (err) {
      console.error(err);
      setSettingsMessage({ type: 'error', text: 'Server error saving settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const stampsPerReward = config?.stampsPerReward || 4;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-mono font-bold border border-brand-green/40 flex items-center gap-1.5 shadow-neon-sm">
              <Award className="w-3.5 h-3.5" />
              <span>LOYALTY & REWARDS HUB</span>
            </span>
            <span className="text-xs font-mono text-gray-400">
              {config?.isActive ? 'Status: Active' : 'Status: Paused'}
            </span>
          </div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-2">
            Loyalty Management Terminal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('terminal')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Fast Stamp Terminal</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-border/40 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard', icon: Sparkles },
          { id: 'terminal', label: 'Fast Scanner / Stamp', icon: QrCode },
          { id: 'customers', label: 'Loyalty Members', icon: Users },
          { id: 'rewards', label: 'Rewards Catalog', icon: Gift },
          { id: 'transactions', label: 'Audit Ledger', icon: History },
          { id: 'settings', label: 'Rules & Settings', icon: SettingsIcon },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                active
                  ? 'bg-brand-green/20 text-brand-green border border-brand-green/50 shadow-neon-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${active ? 'text-brand-green' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-neon-sm relative overflow-hidden">
              <div className="flex items-center gap-3 text-brand-green mb-2">
                <Users className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Total VIP Members</span>
              </div>
              <div className="font-heading font-black text-4xl text-white">
                {stats?.totalMembers || 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {stats?.activeMembers || 0} Active registered accounts
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Stamps Issued</span>
              </div>
              <div className="font-heading font-black text-4xl text-white">
                {stats?.totalLifetimeStamps || 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {stats?.totalActiveStamps || 0} Current active circulating balance
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden">
              <div className="flex items-center gap-3 text-amber-400 mb-2">
                <Gift className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Rewards Claimed</span>
              </div>
              <div className="font-heading font-black text-4xl text-white">
                {stats?.totalRedemptions || 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Free bespoke finishes & treatments delivered
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden">
              <div className="flex items-center gap-3 text-blue-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider">Milestone Rule</span>
              </div>
              <div className="font-heading font-black text-4xl text-white">
                {stampsPerReward} <span className="text-lg font-mono text-gray-400">Stamps</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 truncate">
                {config?.rewardTitle || '1 Free Bespoke Finish'}
              </p>
            </div>
          </div>

          {/* Quick Terminal Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-surface via-black to-brand-surface border border-brand-green/40 shadow-neon-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-green uppercase font-bold tracking-widest">
                WORKSHOP SCAN TERMINAL
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                Have a client vehicle in the workshop?
              </h3>
              <p className="text-xs text-gray-400 max-w-xl">
                Scan their digital pass QR code or type their plate/mobile number to stamp their visit or claim their complimentary service reward.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('terminal')}
              className="px-6 py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all whitespace-nowrap"
            >
              Launch Fast Terminal →
            </button>
          </div>

          {/* Recent Activity Feeds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Stamping Transactions */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-green" />
                  <span>Recent Stamp Transactions</span>
                </h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs text-brand-green hover:underline font-mono"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-black border border-brand-border/40 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-heading font-bold text-white block">
                          {tx.customer?.fullName || 'Client'} • {tx.customer?.loyaltyId}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                          {tx.serviceName || tx.notes} • {formatDate(tx.createdAt)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold text-sm ${
                            tx.amount > 0 ? 'text-brand-green' : 'text-amber-400'
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          Bal: {tx.balanceAfter}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 py-6 text-center font-mono">
                    No transactions recorded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Recent Redemptions */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Recent Reward Redemptions</span>
                </h3>
              </div>

              <div className="space-y-3">
                {recentRedemptions.length > 0 ? (
                  recentRedemptions.map((red) => (
                    <div
                      key={red.id}
                      className="p-3 rounded-xl bg-black border border-amber-500/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-heading font-bold text-white block">
                          {red.rewardTitle}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                          {red.customer?.fullName} • Code: {red.redemptionCode} • {formatDate(red.redeemedAt)}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold uppercase">
                        REDEEMED
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 py-6 text-center font-mono">
                    No redemptions processed yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TERMINAL / FAST SCANNER */}
      {activeTab === 'terminal' && (
        <div className="space-y-8">
          {/* Search / Scan Bar */}
          <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border shadow-neon-sm">
            <h2 className="font-heading font-black text-xl text-white mb-2">
              Workshop Stamp & Redemption Terminal
            </h2>
            <p className="text-xs text-gray-400 font-mono mb-4">
              Enter customer mobile number, plate number, Member ID (e.g. WG-VIP-1029), or scan QR code.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTerminalSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Scan QR or enter Phone / Member ID / Plate No..."
                  value={terminalQuery}
                  onChange={(e) => setTerminalQuery(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-black border border-brand-border text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-brand-green"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={terminalLoading}
                className="px-6 py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all flex items-center justify-center gap-2"
              >
                {terminalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Locate Client</span>
              </button>
            </form>

            {terminalError && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{terminalError}</span>
              </div>
            )}

            {terminalSuccess && (
              <div className="mt-4 p-3.5 rounded-xl bg-brand-green/10 border border-brand-green/40 text-brand-green text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{terminalSuccess}</span>
              </div>
            )}
          </div>

          {/* Customer Loaded Section */}
          {terminalCustomer ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Fast Action Panel */}
              <div className="lg:col-span-6 space-y-6">
                {/* 1-Click Fast Stamp Action */}
                <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border shadow-neon-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-green" />
                      <h3 className="font-heading font-bold text-lg text-white">
                        Award Service Stamp
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-brand-green font-bold">
                      Current: {terminalCustomer.currentStamps}/{stampsPerReward}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                        Completed Service
                      </label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-heading"
                      >
                        {terminalServices.map((svc) => (
                          <option key={svc.id} value={svc.name}>
                            {svc.name}
                          </option>
                        ))}
                        <option value="General Maintenance & Service">General Maintenance & Service</option>
                        <option value="Custom Bodywork & Paint">Custom Bodywork & Paint</option>
                        <option value="Ceramic Detail & Polish">Ceramic Detail & Polish</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                          Invoice / Job Card #
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. INV-90412"
                          value={serviceReference}
                          onChange={(e) => setServiceReference(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                          Stamps to Award
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={stampAmount}
                          onChange={(e) => setStampAmount(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                        Staff Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Front ceramic coating completed"
                        value={stampNotes}
                        onChange={(e) => setStampNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-mono"
                      />
                    </div>

                    <button
                      onClick={handleAddStamp}
                      disabled={stampProcessing}
                      className="w-full py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {stampProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 stroke-[3]" />
                      )}
                      <span>Award +{stampAmount} Stamp to Client</span>
                    </button>
                  </div>
                </div>

                {/* Reward Redemption Panel */}
                <div className="p-6 rounded-3xl bg-brand-surface border border-amber-500/30 shadow-neon-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-400" />
                      <h3 className="font-heading font-bold text-lg text-white">
                        Redeem Free Reward
                      </h3>
                    </div>
                    {terminalCustomer.currentStamps >= stampsPerReward ? (
                      <span className="px-2.5 py-1 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/40 text-[10px] font-mono font-bold uppercase animate-pulse">
                        QUALIFIED
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-gray-400">
                        Needs {stampsPerReward - terminalCustomer.currentStamps} more
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {terminalRewards.map((rew) => {
                      const canRedeem = terminalCustomer.currentStamps >= rew.requiredStamps;
                      return (
                        <div
                          key={rew.id}
                          className="p-4 rounded-2xl bg-black border border-brand-border flex items-center justify-between gap-4"
                        >
                          <div>
                            <span className="font-heading font-bold text-white text-sm block">
                              {rew.title}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                              Requires {rew.requiredStamps} Stamps • {rew.description}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRedeemReward(rew.id)}
                            disabled={!canRedeem || stampProcessing}
                            className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                              canRedeem
                                ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-neon-sm'
                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            }`}
                          >
                            Redeem Reward
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Digital Card Simulation & Client Snapshot */}
              <div className="lg:col-span-6 space-y-6">
                <DigitalLoyaltyCard
                  customer={terminalCustomer}
                  config={config}
                  onRefresh={() => handleTerminalSearch(terminalCustomer.loyaltyId)}
                />

                <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border text-xs font-mono space-y-3">
                  <div className="flex justify-between pb-2 border-b border-brand-border/40">
                    <span className="text-gray-400">Client Mobile:</span>
                    <span className="text-white font-bold">{terminalCustomer.phone}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-brand-border/40">
                    <span className="text-gray-400">Vehicle Plate:</span>
                    <span className="text-brand-green font-bold">{terminalCustomer.plateNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-brand-border/40">
                    <span className="text-gray-400">Lifetime Total Stamps:</span>
                    <span className="text-white font-bold">{terminalCustomer.lifetimeStamps} Stamps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">{terminalCustomer.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-brand-surface/40 border border-dashed border-brand-border text-gray-500 font-mono text-xs">
              Search for a member above or scan their QR code to load the stamping terminal.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search name, phone, plate, ID..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') fetchCustomers(1);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-white text-xs font-mono"
                />
              </div>
              <button
                onClick={() => fetchCustomers(1)}
                className="p-2.5 rounded-xl bg-brand-surface border border-brand-border text-gray-300 hover:text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={customerStatusFilter}
                onChange={(e) => setCustomerStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-white text-xs font-mono"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>

              <button
                onClick={() => {
                  setCustomerFormData({
                    id: '',
                    fullName: '',
                    phone: '',
                    email: '',
                    plateNumber: '',
                    vehicleMake: '',
                    vehicleModel: '',
                    vehicleYear: '',
                    status: 'ACTIVE',
                  });
                  setCustomerModalMode('add');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-neon-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-border bg-black/60 text-gray-400 font-mono uppercase tracking-wider text-[11px]">
                    <th className="p-4">Member ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Plate / Vehicle</th>
                    <th className="p-4">Current Stamps</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-mono">
                  {loadingCustomers ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        Loading loyalty members...
                      </td>
                    </tr>
                  ) : customers.length > 0 ? (
                    customers.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">{c.loyaltyId}</td>
                        <td className="p-4 font-heading font-bold text-white text-sm">
                          {c.fullName}
                        </td>
                        <td className="p-4 text-gray-300">{c.phone}</td>
                        <td className="p-4 text-brand-green font-bold">
                          {c.plateNumber || '—'} {c.vehicleMake ? `(${c.vehicleMake})` : ''}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-white text-sm">
                            {c.currentStamps}
                          </span>{' '}
                          <span className="text-gray-500">/ {stampsPerReward}</span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              c.status === 'ACTIVE'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                : 'bg-red-950 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setTerminalQuery(c.loyaltyId);
                                setActiveTab('terminal');
                                handleTerminalSearch(c.loyaltyId);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-black font-heading font-bold text-[10px] uppercase transition-all"
                            >
                              Stamp
                            </button>
                            <button
                              onClick={() => {
                                setCustomerFormData({
                                  id: c.id,
                                  fullName: c.fullName,
                                  phone: c.phone,
                                  email: c.email || '',
                                  plateNumber: c.plateNumber || '',
                                  vehicleMake: c.vehicleMake || '',
                                  vehicleModel: c.vehicleModel || '',
                                  vehicleYear: c.vehicleYear || '',
                                  status: c.status,
                                });
                                setCustomerModalMode('edit');
                              }}
                              className="p-1.5 rounded-lg bg-black border border-brand-border text-gray-400 hover:text-white"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {customerPagination.totalPages > 1 && (
              <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs font-mono text-gray-400">
                <span>
                  Page {customerPagination.page} of {customerPagination.totalPages} ({customerPagination.total} members)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={customerPagination.page <= 1}
                    onClick={() => fetchCustomers(customerPagination.page - 1)}
                    className="p-2 rounded-lg bg-black border border-brand-border disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={customerPagination.page >= customerPagination.totalPages}
                    onClick={() => fetchCustomers(customerPagination.page + 1)}
                    className="p-2 rounded-lg bg-black border border-brand-border disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Add/Edit Modal */}
      {customerModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-brand-surface border border-brand-border p-6 shadow-neon-lg">
            <button
              onClick={() => setCustomerModalMode(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-xl text-white mb-4">
              {customerModalMode === 'add' ? 'Add Loyalty Member' : 'Edit Member Profile'}
            </h3>

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerFormData.fullName}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={customerFormData.phone}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-gray-400 mb-1">Plate Number</label>
                  <input
                    type="text"
                    value={customerFormData.plateNumber}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, plateNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-400 mb-1">Status</label>
                  <select
                    value={customerFormData.status}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-gray-400 mb-1">Vehicle Make</label>
                  <input
                    type="text"
                    value={customerFormData.vehicleMake}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, vehicleMake: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-400 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={customerFormData.vehicleModel}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, vehicleModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingCustomer}
                  className="w-full py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
                >
                  {savingCustomer ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: REWARDS CATALOG */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-xl text-white">Rewards Catalog</h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Configure rewards available to VIP members upon collecting required stamps.
              </p>
            </div>

            <button
              onClick={() => {
                setRewardFormData({
                  id: '',
                  title: '',
                  description: '',
                  requiredStamps: '4',
                  requiredPoints: '0',
                  validDays: '90',
                  displayOrder: '0',
                  isActive: true,
                });
                setRewardModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Reward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardsList.map((rew) => (
              <div
                key={rew.id}
                className="p-6 rounded-2xl bg-brand-surface border border-brand-border relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/40 text-xs font-mono font-bold">
                      {rew.requiredStamps} Stamps
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        rew.isActive ? 'text-emerald-400' : 'text-gray-500'
                      }`}
                    >
                      {rew.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-white mb-2">{rew.title}</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">{rew.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-500">{rew.redemptionCount} Redeemed</span>
                  <button
                    onClick={() => {
                      setRewardFormData({
                        id: rew.id,
                        title: rew.title,
                        description: rew.description,
                        requiredStamps: String(rew.requiredStamps),
                        requiredPoints: String(rew.requiredPoints),
                        validDays: String(rew.validDays),
                        displayOrder: String(rew.displayOrder),
                        isActive: rew.isActive,
                      });
                      setRewardModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-black border border-brand-border text-gray-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reward Create/Edit Modal */}
      {rewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-brand-surface border border-brand-border p-6 shadow-neon-lg">
            <button
              onClick={() => setRewardModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-xl text-white mb-4">
              {rewardFormData.id ? 'Edit Reward' : 'Create New Reward'}
            </h3>

            <form onSubmit={handleSaveReward} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-gray-400 mb-1">Reward Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 FREE BESPOKE FINISH"
                  value={rewardFormData.title}
                  onChange={(e) => setRewardFormData({ ...rewardFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white uppercase"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of what the customer receives..."
                  value={rewardFormData.description}
                  onChange={(e) => setRewardFormData({ ...rewardFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-gray-400 mb-1">Required Stamps</label>
                  <input
                    type="number"
                    min="1"
                    value={rewardFormData.requiredStamps}
                    onChange={(e) => setRewardFormData({ ...rewardFormData, requiredStamps: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-400 mb-1">Valid Days</label>
                  <input
                    type="number"
                    min="1"
                    value={rewardFormData.validDays}
                    onChange={(e) => setRewardFormData({ ...rewardFormData, validDays: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-brand-border text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="rewardActiveCheck"
                  checked={rewardFormData.isActive}
                  onChange={(e) => setRewardFormData({ ...rewardFormData, isActive: e.target.checked })}
                  className="rounded bg-black border-brand-border text-brand-green"
                />
                <label htmlFor="rewardActiveCheck" className="text-gray-300">
                  Active and available for redemption
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingReward}
                  className="w-full py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
                >
                  {savingReward ? 'Saving...' : 'Save Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRANSACTIONS LEDGER */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-xl text-white">Loyalty Transaction Ledger</h2>
            <select
              value={txTypeFilter}
              onChange={(e) => setTxTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-white text-xs font-mono"
            >
              <option value="ALL">All Event Types</option>
              <option value="STAMP_EARNED">Stamps Earned</option>
              <option value="REWARD_REDEEMED">Rewards Redeemed</option>
              <option value="ACCOUNT_CREATED">Accounts Created</option>
            </select>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-neon-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-border bg-black/60 text-gray-400 font-mono uppercase tracking-wider text-[11px]">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Action Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Balance</th>
                    <th className="p-4">Staff Actor</th>
                    <th className="p-4">Reference / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-mono">
                  {loadingTransactions ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        Loading transaction ledger...
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-400">{formatDate(tx.createdAt)}</td>
                        <td className="p-4 font-bold text-white">
                          {tx.customer?.fullName || 'Client'}{' '}
                          <span className="text-[10px] text-gray-500 block">
                            {tx.customer?.loyaltyId}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${
                              tx.amount > 0
                                ? 'text-brand-green'
                                : tx.amount < 0
                                ? 'text-amber-400'
                                : 'text-gray-400'
                            }`}
                          >
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">{tx.balanceAfter}</td>
                        <td className="p-4 text-gray-400">{tx.adminUsername || 'SYSTEM'}</td>
                        <td className="p-4 text-gray-300 truncate max-w-xs">
                          {tx.serviceName || tx.serviceReference || tx.notes || '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No transactions recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RULES & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-neon-sm">
          <div className="mb-6">
            <h2 className="font-heading font-black text-xl text-white">
              Loyalty Rules & Program Configuration
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Changes saved here immediately update the customer cards, stamp slots, and public rules.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block uppercase text-gray-400 mb-1">Program Title</label>
              <input
                type="text"
                required
                value={settingsFormData.programName}
                onChange={(e) => setSettingsFormData({ ...settingsFormData, programName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black border border-brand-border text-white font-heading font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-400 mb-1">Program Subtitle / Tagline</label>
              <input
                type="text"
                value={settingsFormData.programTagline}
                onChange={(e) => setSettingsFormData({ ...settingsFormData, programTagline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black border border-brand-border text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Stamps Required per Reward *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={settingsFormData.stampsPerReward}
                  onChange={(e) =>
                    setSettingsFormData({
                      ...settingsFormData,
                      stampsPerReward: parseInt(e.target.value, 10) || 4,
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-brand-border text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">Stamps per Visit</label>
                <input
                  type="number"
                  min="1"
                  value={settingsFormData.stampsPerVisit}
                  onChange={(e) =>
                    setSettingsFormData({
                      ...settingsFormData,
                      stampsPerVisit: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-brand-border text-white"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase text-gray-400 mb-1">Default Reward Title</label>
              <input
                type="text"
                value={settingsFormData.rewardTitle}
                onChange={(e) => setSettingsFormData({ ...settingsFormData, rewardTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black border border-brand-border text-white uppercase font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-gray-400 mb-1">Terms & Conditions</label>
              <textarea
                rows={5}
                value={settingsFormData.termsConditions}
                onChange={(e) => setSettingsFormData({ ...settingsFormData, termsConditions: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black border border-brand-border text-white leading-relaxed"
              />
            </div>

            {settingsMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  settingsMessage.type === 'success'
                    ? 'bg-brand-green/10 border border-brand-green/40 text-brand-green'
                    : 'bg-red-950/40 border border-red-500/40 text-red-400'
                }`}
              >
                {settingsMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{settingsMessage.text}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
              >
                {savingSettings ? 'Saving Configuration...' : 'Save Loyalty Program Rules'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminLoyaltyPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-500 font-mono text-sm">
          Loading Loyalty Management Terminal...
        </div>
      }
    >
      <AdminLoyaltyContent />
    </Suspense>
  );
}

