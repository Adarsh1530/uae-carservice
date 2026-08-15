export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const DEFAULT_SETTINGS = {
  id: 'default',
  companyName: 'WALESS GROUP',
  domain: 'walessgroup.ae',
  logoUrl: '/icon.svg',
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

async function ensureTableColumns() {
  try {
    await db.$executeRawUnsafe(
      `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT DEFAULT '/icon.svg';`
    );
  } catch (e) {
    console.warn('Column auto-ensure notice:', e);
  }
}

export async function GET() {
  try {
    await ensureTableColumns();
    let settings = null;
    try {
      settings = await db.siteSettings.findUnique({
        where: { id: 'default' },
      });
    } catch (e) {
      console.warn('DB query error for siteSettings, using fallback:', e);
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

    return NextResponse.json(
      { success: true, settings: { ...DEFAULT_SETTINGS, ...settings } },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: true, settings: DEFAULT_SETTINGS },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized session' }, { status: 401 });
    }

    const body = await req.json();
    await ensureTableColumns();

    const dataToSave = {
      companyName: body.companyName || 'WALESS GROUP',
      domain: body.domain || 'walessgroup.ae',
      logoUrl: body.logoUrl || '/icon.svg',
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
      heroSubheading: body.heroSubheading || 'WALESS GROUP delivers ultra-luxury bespoke vehicle customization.',
      heroImageUrl: body.heroImageUrl || '/uploads/home_page.jpg',
      aboutImageUrl: body.aboutImageUrl || '/uploads/gallery__1_.jpg',
      contactImageUrl: body.contactImageUrl || '/uploads/gallery__12_.jpg',
      seoTitle: body.seoTitle || 'WALESS GROUP | Luxury Automotive & Corporate Solutions UAE',
      seoDescription: body.seoDescription || 'WALESS GROUP UAE',
    };

    let updated = null;
    try {
      updated = await db.siteSettings.upsert({
        where: { id: 'default' },
        update: dataToSave,
        create: {
          id: 'default',
          ...dataToSave,
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
      console.error('Upsert site settings failed, trying direct SQL fallback:', dbErr);
      try {
        await db.$executeRawUnsafe(
          `INSERT INTO "site_settings" ("id", "companyName", "domain", "logoUrl", "phone", "mobile1", "mobile2", "address", "instagram", "whatsapp1", "whatsapp2", "mapLatitude", "mapLongitude", "mapZoom", "heroHeading", "heroSubheading", "heroImageUrl", "aboutImageUrl", "contactImageUrl", "seoTitle", "seoDescription", "updatedAt")
           VALUES ('default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())
           ON CONFLICT ("id") DO UPDATE SET
           "companyName" = EXCLUDED."companyName",
           "domain" = EXCLUDED."domain",
           "logoUrl" = EXCLUDED."logoUrl",
           "phone" = EXCLUDED."phone",
           "mobile1" = EXCLUDED."mobile1",
           "mobile2" = EXCLUDED."mobile2",
           "address" = EXCLUDED."address",
           "instagram" = EXCLUDED."instagram",
           "whatsapp1" = EXCLUDED."whatsapp1",
           "whatsapp2" = EXCLUDED."whatsapp2",
           "mapLatitude" = EXCLUDED."mapLatitude",
           "mapLongitude" = EXCLUDED."mapLongitude",
           "mapZoom" = EXCLUDED."mapZoom",
           "heroHeading" = EXCLUDED."heroHeading",
           "heroSubheading" = EXCLUDED."heroSubheading",
           "heroImageUrl" = EXCLUDED."heroImageUrl",
           "aboutImageUrl" = EXCLUDED."aboutImageUrl",
           "contactImageUrl" = EXCLUDED."contactImageUrl",
           "seoTitle" = EXCLUDED."seoTitle",
           "seoDescription" = EXCLUDED."seoDescription",
           "updatedAt" = NOW();`,
          dataToSave.companyName,
          dataToSave.domain,
          dataToSave.logoUrl,
          dataToSave.phone,
          dataToSave.mobile1,
          dataToSave.mobile2,
          dataToSave.address,
          dataToSave.instagram,
          dataToSave.whatsapp1,
          dataToSave.whatsapp2,
          dataToSave.mapLatitude,
          dataToSave.mapLongitude,
          dataToSave.mapZoom,
          dataToSave.heroHeading,
          dataToSave.heroSubheading,
          dataToSave.heroImageUrl,
          dataToSave.aboutImageUrl,
          dataToSave.contactImageUrl,
          dataToSave.seoTitle,
          dataToSave.seoDescription
        );
        updated = { id: 'default', ...dataToSave };
      } catch (sqlErr) {
        console.error('SQL Fallback failed:', sqlErr);
        return NextResponse.json(
          { success: false, error: 'Database update failed: ' + (sqlErr as Error).message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, settings: updated || { id: 'default', ...dataToSave } },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
