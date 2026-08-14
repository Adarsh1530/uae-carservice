'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FolderOpen, Upload, Trash2, Copy, Check, Search, Loader2 } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMediaList(data.media || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'MediaLibrary');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchMedia();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchMedia();
      else alert(data.error || 'Failed to delete media');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
            CMS ASSETS
          </span>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mt-1">
            Media Library
          </h1>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? 'UPLOADING...' : 'UPLOAD NEW FILE'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="flex items-center gap-4 bg-brand-surface p-4 rounded-2xl border border-brand-border">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search media files by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-black border border-brand-border text-white text-xs focus:border-brand-green focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-mono text-sm">Loading Media Library...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm">No media files found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-brand-surface border border-brand-border rounded-2xl p-3 space-y-3 shadow-neon-sm"
            >
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-brand-border">
                <Image src={item.url} alt={item.filename} fill className="object-cover" />
              </div>
              <div className="text-[11px] font-mono text-gray-300 truncate">{item.filename}</div>

              <div className="flex items-center justify-between pt-1 border-t border-brand-border/60">
                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-brand-green hover:underline"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === item.id ? 'COPIED!' : 'COPY URL'}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded bg-red-950/60 text-red-400 hover:bg-red-900"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
