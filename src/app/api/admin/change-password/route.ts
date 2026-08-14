import { NextResponse } from 'next/server';
import { getAdminSession, hashPassword, verifyPassword } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'New passwords do not match' }, { status: 400 });
    }

    if (newPassword.length < 12) {
      return NextResponse.json({ success: false, error: 'Password must be at least 12 characters long' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
    }

    const isValid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);

    await db.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    await db.auditLog.create({
      data: {
        adminUsername: admin.username,
        action: 'CHANGE_PASSWORD',
        entityType: 'Admin',
        entityId: admin.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ success: false, error: 'Failed to update password' }, { status: 500 });
  }
}
