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

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }

    const mediaList = await db.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

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

    const item = await db.media.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Media item not found' }, { status: 404 });
    }

    // Optionally remove physical file if stored locally
    if (item.url.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (e) {
          console.warn('Could not delete local file:', e);
        }
      }
    }

    await db.media.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'DELETE_MEDIA',
        entityType: 'Media',
        entityId: id,
        metadata: JSON.stringify({ filename: item.filename }),
      },
    });

    return NextResponse.json({ success: true, message: 'Media item deleted' });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}
