'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Upload,
  Eye,
  Loader2,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { ServiceItem } from '@/lib/types';
import { compressAndUploadImage } from '@/lib/clientUpload';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDesc: '',
    detailedDesc: '',
    mainImage: '',
    additionalImagesStr: '',
    featuresStr: '',
    priceInfo: '',
    displayOrder: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  const fetchServices = () => {
    setLoading(true);
    fetch('/api/services?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openNewForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      shortDesc: '',
      detailedDesc: '',
      mainImage: '',
      additionalImagesStr: '',
      featuresStr: '',
      priceInfo: '250 AED',
      displayOrder: services.length + 1,
      active: true,
    });
    setFormOpen(true);
  };

  const openEditForm = (svc: ServiceItem) => {
    setEditingId(svc.id);
    setFormData({
      name: svc.name,
      slug: svc.slug,
      shortDesc: svc.shortDesc,
      detailedDesc: svc.detailedDesc,
      mainImage: svc.mainImage,
      additionalImagesStr: Array.isArray(svc.additionalImages) ? svc.additionalImages.join('\n') : '',
      featuresStr: Array.isArray(svc.features) ? svc.features.join('\n') : '',
      priceInfo: svc.priceInfo || '',
      displayOrder: svc.displayOrder,
      active: svc.active,
    });
    setFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const uploadedUrl = await compressAndUploadImage(file, 'Services');
      setFormData((prev) => ({ ...prev, mainImage: uploadedUrl }));
    } catch (err: any) {
      console.error('Service image upload error:', err);
      if (err.message?.includes('Unauthorized')) {
        alert('Your session expired. Please sign in to the Admin Panel.');
        window.location.href = '/admin/login';
      } else {
        alert(err.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: editingId,
      name: formData.name,
      slug: formData.slug,
      shortDesc: formData.shortDesc,
      detailedDesc: formData.detailedDesc,
      mainImage: formData.mainImage,
      additionalImages: formData.additionalImagesStr.split('\n').map((s) => s.trim()).filter(Boolean),
      features: formData.featuresStr.split('\n').map((s) => s.trim()).filter(Boolean),
      priceInfo: formData.priceInfo,
      displayOrder: Number(formData.displayOrder),
      active: formData.active,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        setFormOpen(false);
        fetchServices();
      } else {
        alert(resData.error || 'Failed to save service');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/services?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setDeleteTarget(null);
        fetchServices();
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
            CMS MANAGEMENT
          </span>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-1">
            Services Catalog CRUD
          </h1>
        </div>

        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-mono text-sm">Loading Services...</div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm">
          No services added yet. Click &quot;Add New Service&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                svc.active
                  ? 'bg-brand-surface border-brand-border hover:border-brand-green/50 shadow-neon-sm'
                  : 'bg-black/60 border-red-900/40 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-brand-border">
                  <Image src={svc.mainImage} alt={svc.name} fill className="object-cover" />
                  {!svc.active && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[10px] uppercase font-bold border border-red-500/40">
                      INACTIVE
                    </div>
                  )}
                  {svc.priceInfo && (
                    <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-brand-green font-mono text-xs font-bold border border-brand-green/40 shadow-neon-sm">
                      {svc.priceInfo}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-mono text-brand-green uppercase tracking-widest block">
                    ORDER: #{svc.displayOrder}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white mt-0.5">{svc.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {svc.shortDesc || 'Bespoke WALESS GROUP Executive Service'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditForm(svc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-brand-border text-xs text-gray-300 hover:text-brand-green hover:border-brand-green transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(svc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-400 hover:bg-red-900/60 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-brand-surface border border-brand-green/40 rounded-2xl p-6 sm:p-8 space-y-6 my-8 shadow-neon-xl relative">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-brand-border pb-3">
              <span className="text-xs font-mono text-brand-green uppercase">SERVICE FORM</span>
              <h2 className="font-heading font-extrabold text-2xl text-white">
                {editingId ? 'Edit Service' : 'Create New Service'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Car Wash with Polish"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated-if-blank"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                  />
                </div>
              </div>

              {/* Price in UAE Currency (AED) */}
              <div className="p-4 rounded-xl bg-black/60 border border-brand-green/30 space-y-2">
                <label className="block text-xs font-mono uppercase text-brand-green font-bold flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-green" />
                  <span>PRICE IN UAE CURRENCY (AED)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 250 AED or 500 AED or Quote Upon Request"
                  value={formData.priceInfo}
                  onChange={(e) => setFormData({ ...formData, priceInfo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-brand-green font-mono font-bold text-sm focus:border-brand-green focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 block">
                  Enter amount in UAE Dirhams (AED) or custom pricing description (e.g. 250 AED).
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                  Main Image URL *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Upload image or paste URL"
                    value={formData.mainImage}
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-green text-brand-green text-xs font-heading font-bold hover:bg-brand-green hover:text-black transition-all flex items-center gap-1.5">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>UPLOAD</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Short Summary <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional brief description of the service..."
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Full Detailed Description <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional detailed service description..."
                  value={formData.detailedDesc}
                  onChange={(e) => setFormData({ ...formData, detailedDesc: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                  Key Features (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Full Exterior Wash & Polish&#10;Interior Deep Cleaning&#10;Paint Protection Sealant"
                  value={formData.featuresStr}
                  onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="activeToggle"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-brand-green cursor-pointer"
                  />
                  <label htmlFor="activeToggle" className="text-xs font-heading uppercase text-white cursor-pointer select-none">
                    Active / Published
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-heading hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
                >
                  {saving ? 'SAVING...' : 'SAVE SERVICE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-surface border border-red-500/50 rounded-2xl p-6 text-center space-y-4 shadow-neon-lg">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-heading font-extrabold text-xl text-white">ARE YOU SURE?</h3>
            <p className="text-xs text-gray-300">
              Permanently delete service <strong className="text-red-400">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl bg-black border border-brand-border text-white text-xs font-heading"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-heading font-bold hover:bg-red-500"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
