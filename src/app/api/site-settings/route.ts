export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const DEFAULT_SETTINGS = {
  id: 'default',
  companyName: 'WHALESS GROUP',
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
  heroSubheading: 'WHALESS GROUP delivers ultra-luxury bespoke vehicle customization, high-performance tuning, and elite corporate services across Ras Al Khaimah and the UAE.',
  heroImageUrl: '/uploads/home_page.jpg',
  aboutImageUrl: '/uploads/gallery__1_.jpg',
  contactImageUrl: '/uploads/gallery__12_.jpg',
  seoTitle: 'WHALESS GROUP | Luxury Automotive & Corporate Solutions UAE',
  seoDescription: 'Official website of WHALESS GROUP, Ras Al Khaimah. Premium bespoke vehicle modifications, executive detailing, performance upgrades, and corporate services.',
};

export async function GET() {
  try {
    let settings = null;
    try {
      settings = await db.siteSettings.findUnique({
        where: { id: 'default' },
      });
    } catch (e) {
      console.warn('DB query error for siteSettings, using default fallback:', e);
    }

    if (!settings) {
      try {
        settings = await db.siteSettings.create({
          data: DEFAULT_SETTINGS,
        });
      } catch (createErr) {
        settings = DEFAULT_SETTINGS;
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    let updated = null;
    try {
      updated = await db.siteSettings.upsert({
        where: { id: 'default' },
        update: {
          companyName: body.companyName || 'WHALESS GROUP',
          domain: body.domain || 'walessgroup.ae',
          phone: body.phone || '+971 7 222 868',
          mobile1: body.mobile1 || '+971 54 307 2733',
          mobile2: body.mobile2 || '+971 54 307 2711',
          address: body.address || 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES',
          instagram: body.instagram || '@waless_group',
          whatsapp1: body.whatsapp1 || '+971543072733',
          whatsapp2: body.whatsapp2 || '+971543072711',
          mapLatitude: parseFloat(body.mapLatitude) || 25.7533,
          mapLongitude: parseFloat(body.mapLongitude) || 55.9525,
          mapZoom: parseInt(body.mapZoom) || 14,
          heroHeading: body.heroHeading || 'ELEVATING AUTOMOTIVE & CORPORATE EXCELLENCE IN UAE',
          heroSubheading: body.heroSubheading || 'WHALESS GROUP delivers ultra-luxury bespoke vehicle customization.',
          heroImageUrl: body.heroImageUrl || '/uploads/home_page.jpg',
          aboutImageUrl: body.aboutImageUrl || '/uploads/gallery__1_.jpg',
          contactImageUrl: body.contactImageUrl || '/uploads/gallery__12_.jpg',
          seoTitle: body.seoTitle || 'WHALESS GROUP',
          seoDescription: body.seoDescription || 'WHALESS GROUP UAE',
        },
        create: {
          id: 'default',
          companyName: body.companyName || 'WHALESS GROUP',
          domain: body.domain || 'walessgroup.ae',
          phone: body.phone || '+971 7 222 868',
          mobile1: body.mobile1 || '+971 54 307 2733',
          mobile2: body.mobile2 || '+971 54 307 2711',
          address: body.address || 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES',
          instagram: body.instagram || '@waless_group',
          whatsapp1: body.whatsapp1 || '+971543072733',
          whatsapp2: body.whatsapp2 || '+971543072711',
          mapLatitude: parseFloat(body.mapLatitude) || 25.7533,
          mapLongitude: parseFloat(body.mapLongitude) || 55.9525,
          mapZoom: parseInt(body.mapZoom) || 14,
          heroHeading: body.heroHeading || 'ELEVATING AUTOMOTIVE & CORPORATE EXCELLENCE IN UAE',
          heroSubheading: body.heroSubheading || 'WHALESS GROUP delivers ultra-luxury bespoke vehicle customization.',
          heroImageUrl: body.heroImageUrl || '/uploads/home_page.jpg',
          aboutImageUrl: body.aboutImageUrl || '/uploads/gallery__1_.jpg',
          contactImageUrl: body.contactImageUrl || '/uploads/gallery__12_.jpg',
          seoTitle: body.seoTitle || 'WHALESS GROUP',
          seoDescription: body.seoDescription || 'WHALESS GROUP UAE',
        },
      });

      try {
        await db.auditLog.create({
          data: {
            adminUsername: session.username,
            action: 'UPDATE_SITE_SETTINGS',
            entityType: 'SiteSettings',
            entityId: 'default',
          },
        });
      } catch (e) {}
    } catch (dbErr) {
      console.warn('Upsert site settings DB warning:', dbErr);
      updated = { ...DEFAULT_SETTINGS, ...body };
    }

    return NextResponse.json({ success: true, settings: updated || DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update site settings' }, { status: 500 });
  }
}
