import { NextResponse } from 'next/server';
import { clearAdminSession, getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (session) {
      await db.auditLog.create({
        data: {
          adminUsername: session.username,
          action: 'ADMIN_LOGOUT',
          entityType: 'Admin',
          entityId: session.id,
        },
      });
    }

    await clearAdminSession();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 });
  }
}
