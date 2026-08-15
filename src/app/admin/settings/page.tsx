'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Settings, Save, Loader2, CheckCircle2, Upload } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'default',
  companyName: 'WALESS GROUP',
  domain: 'walessgroup.ae',
  phone: '+971 7 222 868',
  mobile1: '+971 54 307 2733',
  mobile2: '+971 54 307 2711',
  address: 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES',
  instagram: '@waless_group',
  whatsapp1: '+971543072733',
  whatsapp2: '+971543072711',
  mapLatitude: 25.7533,
  mapLongitude: 55.9525,
  mapZoom: 14,
  heroHeading: 'ELEVATING AUTOMOTIVE & CORPORATE EXCELLENCE IN UAE',
  heroSubheading: 'WALESS GROUP delivers ultra-luxury bespoke vehicle customization, high-performance tuning, and elite corporate services across Ras Al Khaimah and the UAE.',
  heroImageUrl: '/uploads/home_page.jpg',
  aboutImageUrl: '/uploads/gallery__1_.jpg',
  contactImageUrl: '/uploads/gallery__12_.jpg',
  seoTitle: 'WALESS GROUP | Luxury Automotive & Corporate Solutions UAE',
  seoDescription: 'Official website of WALESS GROUP, Ras Al Khaimah. Premium bespoke vehicle modifications, executive detailing, performance upgrades, and corporate services.',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({ ...DEFAULT_SETTINGS, logoUrl: '/icon.svg' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, logoUrl: '/icon.svg', ...data.settings });
        }
      })
      .catch((e) => console.warn('Fetch site settings error:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const data = new FormData();
    data.append('file', file);
    data.append('category', 'Logos');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const resData = await res.json();
      if (resData.success && resData.url) {
        setSettings((prev: any) => ({ ...prev, logoUrl: resData.url }));
      } else {
        alert(resData.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Site settings and logo updated successfully!');
        if (data.settings) setSettings((prev: any) => ({ ...prev, ...data.settings }));
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500 font-mono text-sm">Loading Settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
            SYSTEM CONFIGURATION
          </span>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-1">
            Global Site Settings
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'SAVING...' : 'PUBLISH CHANGES'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity & Logo */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <h3 className="font-heading font-bold text-lg text-white border-l-2 border-brand-green pl-3">
            Company Identity & Brand Logo
          </h3>

          {/* Logo Upload Section */}
          <div className="p-4 rounded-xl bg-black/80 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl border border-brand-green/50 bg-black overflow-hidden shadow-neon-sm flex items-center justify-center">
                {settings.logoUrl ? (
                  <Image src={settings.logoUrl} alt="WALESS GROUP Logo" fill className="object-contain p-1" />
                ) : (
                  <span className="text-xs font-mono text-gray-500">No Logo</span>
                )}
              </div>
              <div>
                <span className="text-xs font-mono text-brand-green uppercase font-bold block">
                  Official Website Logo
                </span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Uploaded logo displays across site navigation, footer, & admin portal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={settings.logoUrl || ''}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="/icon.svg"
                className="flex-1 sm:w-64 px-3 py-2 rounded-xl bg-black border border-brand-border text-white text-xs font-mono focus:border-brand-green"
              />
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-brand-surface border border-brand-green text-brand-green text-xs font-heading font-bold hover:bg-brand-green hover:text-black transition-all flex items-center gap-1.5 shrink-0">
                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>UPLOAD</span>
                <input type="file" accept="image/*,.svg" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-bold focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Domain</label>
              <input
                type="text"
                value={settings.domain}
                onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <h3 className="font-heading font-bold text-lg text-white border-l-2 border-brand-green pl-3">
            Contact Lines & Addresses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Primary Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Mobile Line 1</label>
              <input
                type="text"
                value={settings.mobile1}
                onChange={(e) => setSettings({ ...settings, mobile1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Mobile Line 2</label>
              <input
                type="text"
                value={settings.mobile2}
                onChange={(e) => setSettings({ ...settings, mobile2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">WhatsApp 1</label>
              <input
                type="text"
                value={settings.whatsapp1}
                onChange={(e) => setSettings({ ...settings, whatsapp1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">WhatsApp 2</label>
              <input
                type="text"
                value={settings.whatsapp2}
                onChange={(e) => setSettings({ ...settings, whatsapp2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Interactive Map Coordinates */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <h3 className="font-heading font-bold text-lg text-white border-l-2 border-brand-green pl-3">
            Map Location (Al Dhait South, Ras Al Khaimah)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Latitude</label>
              <input
                type="number"
                step="0.00001"
                value={settings.mapLatitude}
                onChange={(e) => setSettings({ ...settings, mapLatitude: parseFloat(e.target.value) || 25.7533 })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Longitude</label>
              <input
                type="number"
                step="0.00001"
                value={settings.mapLongitude}
                onChange={(e) => setSettings({ ...settings, mapLongitude: parseFloat(e.target.value) || 55.9525 })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Map Zoom Level</label>
              <input
                type="number"
                value={settings.mapZoom}
                onChange={(e) => setSettings({ ...settings, mapZoom: parseInt(e.target.value) || 14 })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Hero & SEO */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <h3 className="font-heading font-bold text-lg text-white border-l-2 border-brand-green pl-3">
            Hero Heading & SEO Metadata
          </h3>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Hero Title</label>
            <input
              type="text"
              value={settings.heroHeading}
              onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Hero Subheading</label>
            <textarea
              rows={2}
              value={settings.heroSubheading}
              onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
              className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">SEO Title</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">SEO Description</label>
            <textarea
              rows={2}
              value={settings.seoDescription}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-md"
          >
            {saving ? 'PUBLISHING...' : 'SAVE & PUBLISH SETTINGS'}
          </button>
        </div>
      </form>
    </div>
  );
}
