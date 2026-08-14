export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { COOKIE_NAME, getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (session) {
      try {
        await db.auditLog.create({
          data: {
            adminUsername: session.username,
            action: 'ADMIN_LOGOUT',
            entityType: 'Admin',
            entityId: session.id,
          },
        });
      } catch (e) {}
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete(COOKIE_NAME);
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 });
  }
}
