import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setAdminSession, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({
      where: { username: username.trim() },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    await setAdminSession({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });

    await db.auditLog.create({
      data: {
        adminUsername: admin.username,
        action: 'ADMIN_LOGIN',
        entityType: 'Admin',
        entityId: admin.id,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json({ success: false, error: 'Server authentication error' }, { status: 500 });
  }
}
