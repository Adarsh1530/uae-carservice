export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionToken, verifyPassword, hashPassword, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    const cleanUsername = username.trim();

    let admin = null;
    try {
      admin = await db.admin.findUnique({
        where: { username: cleanUsername },
      });
    } catch (dbError) {
      console.warn('DB query warning during admin fetch:', dbError);
    }

    // Auto-bootstrap admin user if not found in database yet
    if (!admin && cleanUsername === 'WALESSGROUP') {
      const passwordHash = await hashPassword('Walessgroup@2026');
      try {
        admin = await db.admin.create({
          data: {
            username: 'WALESSGROUP',
            passwordHash,
            name: 'WHALESS GROUP Administrator',
            role: 'ADMIN',
          },
        });
      } catch (createError) {
        console.warn('Could not auto-create admin in DB:', createError);
      }
    }

    // Authenticate
    let isValid = false;
    if (admin) {
      isValid = await verifyPassword(password, admin.passwordHash);
    } else if (cleanUsername === 'WALESSGROUP' && password === 'Walessgroup@2026') {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const adminPayload = {
      id: admin?.id || 'admin-bootstrap-id',
      username: cleanUsername,
      role: 'ADMIN',
    };

    const token = await createSessionToken(adminPayload);

    try {
      await db.auditLog.create({
        data: {
          adminUsername: cleanUsername,
          action: 'ADMIN_LOGIN',
          entityType: 'Admin',
          entityId: admin?.id || 'admin-bootstrap-id',
        },
      });
    } catch (auditError) {
      // Non-critical audit log error
    }

    const response = NextResponse.json({
      success: true,
      user: {
        username: cleanUsername,
        name: admin?.name || 'WHALESS GROUP Administrator',
        role: 'ADMIN',
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    console.error('Error logging in admin:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server authentication error' },
      { status: 500 }
    );
  }
}
