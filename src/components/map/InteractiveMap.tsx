'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  address?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude = 25.7533,
  longitude = 55.9525,
  zoom = 14,
  address = 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  if (!mounted) {
    return (
      <div className="w-full h-80 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center text-gray-500">
        Loading Interactive Map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden border border-brand-border shadow-neon-sm bg-brand-surface group">
      {/* Dark Leaflet map iframe or OpenStreetMap view */}
      <iframe
        title="WALESS GROUP Location Map"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`}
      />

      {/* Floating Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-black/90 backdrop-blur-md p-4 rounded-xl border border-brand-green/40 shadow-neon-md flex items-start gap-3.5 z-20">
        <div className="w-10 h-10 rounded-lg bg-brand-green/20 border border-brand-green/60 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-brand-green" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-bold text-white text-sm">WALESS GROUP HEADQUARTERS</h4>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{address}</p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brand-green font-semibold hover:underline mt-2.5"
          >
            <span>Open in Maps App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
