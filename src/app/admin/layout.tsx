'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row selection:bg-brand-green selection:text-black">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 min-h-screen bg-black">
        <main className="p-4 sm:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
