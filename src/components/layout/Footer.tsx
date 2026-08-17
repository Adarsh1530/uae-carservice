'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Instagram, Calendar, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  onOpenBooking?: () => void;
  settings?: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, settings: initialSettings }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings || null);

  useEffect(() => {
    if (!initialSettings) {
      fetch('/api/site-settings?_t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) setSettings(data.settings);
        })
        .catch((e) => console.warn('Footer settings fetch warning:', e));
    } else {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const logoUrl = (settings as any)?.logoUrl || '/icon.svg';
  const companyName = settings?.companyName || 'WALESS GROUP';
  const firstWord = companyName.split(' ')[0] || 'WALESS';
  const secondWord = companyName.split(' ').slice(1).join(' ') || 'GROUP';
  const address = settings?.address || 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES';
  const phone = settings?.phone || '+971 7 222 868';
  const mobile1 = settings?.mobile1 || '+971 54 307 2733';
  const mobile2 = settings?.mobile2 || '+971 54 307 2711';
  const instagram = settings?.instagram || '@waless_group';
  const instagramClean = instagram.replace('@', '');

  return (
    <footer className="relative bg-black border-t border-brand-border/60 overflow-hidden text-gray-400">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-neon-sm bg-black">
                <Image src={logoUrl} alt={`${companyName} Logo`} fill className="object-contain p-0.5" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-widest text-white">
                {firstWord}<span className="text-brand-green ml-1.5">{secondWord}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The premier destination in Ras Al Khaimah and across the UAE for ultra-luxury bespoke automobile customization, precision tuning, ceramic protection, and executive solutions.
            </p>
            <div className="pt-2">
              <a
                href={`https://instagram.com/${instagramClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-border text-xs font-semibold text-white hover:text-brand-green hover:border-brand-green/60 transition-all duration-300 shadow-neon-sm"
              >
                <Instagram className="w-4 h-4 text-brand-green" />
                <span>{instagram}</span>
                <ArrowUpRight className="w-3 h-3 text-gray-500" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wider mb-5 border-l-2 border-brand-green pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Our Services', href: '/services' },
                { name: 'Project Gallery', href: '/gallery' },
                { name: 'Contact & Map', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-green transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="text-brand-green font-bold text-xs">›</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wider mb-5 border-l-2 border-brand-green pl-3">
              Direct Contact
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-snug">
                  {address}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-gray-300 hover:text-brand-green transition-colors">
                  {phone}
                </a>
              </div>
              {mobile1 && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-green shrink-0" />
                  <a href={`tel:${mobile1.replace(/\s+/g, '')}`} className="text-gray-300 hover:text-brand-green transition-colors">
                    {mobile1}
                  </a>
                </div>
              )}
              {mobile2 && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-green shrink-0" />
                  <a href={`tel:${mobile2.replace(/\s+/g, '')}`} className="text-gray-300 hover:text-brand-green transition-colors">
                    {mobile2}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Col 4: Booking CTA */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wider mb-5 border-l-2 border-brand-green pl-3">
              Schedule Service
            </h3>
            <p className="text-sm text-gray-400">
              Request a private appointment for your luxury automobile or consultation with our executive team.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-green text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-greenLight shadow-neon-sm hover:shadow-neon-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Appointment</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Ras Al Khaimah • UAE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
