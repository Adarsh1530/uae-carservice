export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      totalServices,
      totalGallery,
      totalMedia,
      recentBookings,
      recentLogs,
    ] = await Promise.all([
      db.booking.count(),
      db.booking.count({ where: { status: 'PENDING' } }),
      db.booking.count({ where: { status: 'ACCEPTED' } }),
      db.booking.count({ where: { status: 'REJECTED' } }),
      db.service.count(),
      db.galleryImage.count(),
      db.media.count(),
      db.booking.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      db.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        acceptedBookings,
        rejectedBookings,
        totalServices,
        totalGallery,
        totalMedia,
      },
      recentBookings,
      recentLogs,
    });
  } catch (error) {
    console.error('Error loading admin dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to load dashboard metrics' }, { status: 500 });
  }
}
