'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Loader2,
  X,
  Edit3,
  Tag,
} from 'lucide-react';
import { GalleryItem } from '@/lib/types';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Form Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Luxury Customization');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const fetchGallery = () => {
    setLoading(true);
    fetch('/api/gallery?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGallery(data.gallery || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory('Luxury Customization');
    setDisplayOrder(gallery.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setDisplayOrder(item.displayOrder);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('category', 'Gallery');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const resData = await res.json();
      if (resData.success && resData.url) {
        setImageUrl(resData.url);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
      } else {
        alert(resData.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert('Title and Image URL are required');
      return;
    }
    setSaving(true);

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = {
        id: editingItem?.id,
        title,
        description,
        imageUrl,
        category,
        displayOrder,
      };

      const res = await fetch('/api/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const resData = await res.json();
      if (resData.success) {
        setModalOpen(false);
        fetchGallery();
      } else {
        alert(resData.error || 'Failed to save image');
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
      const res = await fetch(`/api/gallery?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setDeleteTarget(null);
        fetchGallery();
      } else {
        alert(data.error || 'Failed to delete image');
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
            Gallery Manager
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-mono text-sm">Loading Gallery...</div>
      ) : gallery.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm">No gallery items found. Click &quot;Upload Image&quot; to add.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-brand-surface border border-brand-border hover:border-brand-green/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-neon-sm"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-brand-border">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-white mt-0.5 line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg bg-black border border-brand-border text-gray-300 hover:text-brand-green"
                  title="Edit Metadata"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-brand-surface border border-brand-green/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-neon-xl relative"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-brand-border pb-3">
              <span className="text-xs font-mono text-brand-green uppercase">GALLERY ITEM</span>
              <h2 className="font-heading font-extrabold text-xl text-white">
                {editingItem ? 'Edit Image Metadata' : 'Upload Gallery Image'}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                Image Source / Upload *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="/uploads/myimage.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
                />
                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-green text-brand-green text-xs font-heading font-bold hover:bg-brand-green hover:text-black transition-all">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                Image Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
              >
                <option value="Luxury Customization">Luxury Customization</option>
                <option value="Detailing & PPF">Detailing & PPF</option>
                <option value="Performance Tuning">Performance Tuning</option>
                <option value="VIP Cabin">VIP Cabin</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-black border border-brand-border text-white text-xs font-heading"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm"
              >
                {saving ? 'SAVING...' : 'SAVE IMAGE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-surface border border-red-500/50 rounded-2xl p-6 text-center space-y-4 shadow-neon-lg">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-heading font-extrabold text-xl text-white">ARE YOU SURE?</h3>
            <p className="text-xs text-gray-300">
              Permanently delete image <strong className="text-red-400">{deleteTarget.title}</strong>? This action cannot be undone.
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
