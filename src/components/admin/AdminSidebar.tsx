'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Globe,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [websiteOpen, setWebsiteOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Services', href: '/admin/services', icon: Layers },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Media Library', href: '/admin/media', icon: FolderOpen },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
    { name: 'Admin Profile', href: '/admin/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-brand-surface border-b border-brand-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center font-bold text-black text-sm">
            W
          </div>
            <span className="font-heading font-black text-sm tracking-wider text-white group-hover:text-brand-green transition-colors">
              WALESS <span className="text-brand-green">ADMIN</span>
            </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-black border border-brand-border text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface border-r border-brand-border flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-green to-emerald-700 flex items-center justify-center font-heading font-black text-black text-lg shadow-neon-sm">
                W
              </div>
              <div>
                <span className="font-heading font-extrabold text-white text-base tracking-wider block">
                  WHALESS<span className="text-brand-green ml-1">ADMIN</span>
                </span>
                <span className="text-[10px] font-mono text-brand-muted uppercase">CMS Control Center</span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-heading uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-brand-green/20 text-brand-green border border-brand-green/50 shadow-neon-sm font-bold'
                      : 'text-gray-400 hover:bg-black/60 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-brand-green' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-border space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-black border border-brand-border text-xs text-gray-300 hover:text-brand-green hover:border-brand-green/50 transition-all"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-green" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-brand-green">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 text-xs font-heading font-bold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
