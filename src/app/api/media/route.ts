export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let mediaList: any[] = [];
    try {
      mediaList = await db.media.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('DB media fetch fallback:', e);
    }

    // Combine with images from Services and Gallery so all images automatically display
    const seenUrls = new Set(mediaList.map((m) => m.url));

    try {
      const [services, gallery] = await Promise.all([
        db.service.findMany({ select: { id: true, name: true, mainImage: true, createdAt: true } }),
        db.galleryImage.findMany({ select: { id: true, title: true, imageUrl: true, createdAt: true } }),
      ]);

      services.forEach((s) => {
        if (s.mainImage && !seenUrls.has(s.mainImage)) {
          seenUrls.add(s.mainImage);
          mediaList.push({
            id: `svc-${s.id}`,
            filename: `${s.name} (Service Image)`,
            url: s.mainImage,
            mimeType: s.mainImage.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
            size: s.mainImage.length,
            createdAt: s.createdAt,
          });
        }
      });

      gallery.forEach((g) => {
        if (g.imageUrl && !seenUrls.has(g.imageUrl)) {
          seenUrls.add(g.imageUrl);
          mediaList.push({
            id: `gal-${g.id}`,
            filename: `${g.title} (Gallery Image)`,
            url: g.imageUrl,
            mimeType: g.imageUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
            size: g.imageUrl.length,
            createdAt: g.createdAt,
          });
        }
      });
    } catch (err) {
      console.warn('Service/Gallery aggregation fallback:', err);
    }

    return NextResponse.json({ success: true, media: mediaList });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch media list' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Media ID is required' }, { status: 400 });
    }

    try {
      if (id.startsWith('svc-')) {
        const realId = id.replace('svc-', '');
        await db.service.update({ where: { id: realId }, data: { mainImage: '/uploads/home_page.jpg' } });
      } else if (id.startsWith('gal-')) {
        const realId = id.replace('gal-', '');
        await db.galleryImage.delete({ where: { id: realId } });
      } else {
        await db.media.delete({ where: { id } });
      }
    } catch (e) {
      console.warn('Delete media DB error:', e);
    }

    return NextResponse.json({ success: true, message: 'Media item deleted' });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}
