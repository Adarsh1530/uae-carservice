'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Instagram, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenBooking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer className="relative bg-black border-t border-brand-border/60 overflow-hidden text-gray-400">
      {/* Soft background neon glow ambient circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-green to-emerald-700 flex items-center justify-center shadow-neon-sm">
                <span className="font-heading font-black text-black text-xl">W</span>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-widest text-white">
                WHALESS<span className="text-brand-green ml-1.5">GROUP</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The premier destination in Ras Al Khaimah and across the UAE for ultra-luxury bespoke automobile customization, precision tuning, ceramic protection, and executive solutions.
            </p>
            <div className="pt-2">
              <a
                href="https://instagram.com/waless_group"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-border text-xs font-semibold text-white hover:text-brand-green hover:border-brand-green/60 transition-all duration-300 shadow-neon-sm"
              >
                <Instagram className="w-4 h-4 text-brand-green" />
                <span>@waless_group</span>
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
                  AL DHAIT SOUTH,<br />
                  RAS AL KHAIMAH,<br />
                  UNITED ARAB EMIRATES
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <a href="tel:+9717222868" className="text-gray-300 hover:text-brand-green transition-colors">
                  +971 7 222 868
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <a href="tel:+971543072733" className="text-gray-300 hover:text-brand-green transition-colors">
                  +971 54 307 2733
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <a href="tel:+971543072711" className="text-gray-300 hover:text-brand-green transition-colors">
                  +971 54 307 2711
                </a>
              </div>
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
          <p>© {new Date().getFullYear()} WHALESS GROUP. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Ras Al Khaimah • UAE</span>
            <Link href="/admin/login" className="hover:text-brand-green transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
