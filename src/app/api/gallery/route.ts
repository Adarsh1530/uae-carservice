export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('all') === 'true';

    const session = await getAdminSession();
    const showAll = includeInactive && session !== null;

    const whereClause: any = {};
    if (!showAll) whereClause.active = true;
    if (category && category !== 'All') whereClause.category = category;

    let gallery: any[] = [];
    try {
      gallery = await db.galleryImage.findMany({
        where: whereClause,
        orderBy: { displayOrder: 'asc' },
      });
    } catch (e) {
      console.warn('DB gallery fetch fallback:', e);
    }

    return NextResponse.json({ success: true, gallery });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, imageUrl, category, displayOrder, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, error: 'Title and Image URL are required' }, { status: 400 });
    }

    const created = await db.galleryImage.create({
      data: {
        title: title.trim(),
        description: description && description.trim() ? description.trim() : null,
        imageUrl,
        category: category || 'Luxury Customization',
        displayOrder: parseInt(displayOrder) || 1,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    try {
      await db.auditLog.create({
        data: {
          adminUsername: session.username,
          action: 'CREATE_GALLERY_IMAGE',
          entityType: 'GalleryImage',
          entityId: created.id,
        },
      });
    } catch (auditErr) {}

    return NextResponse.json({ success: true, galleryImage: created });
  } catch (error: any) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, imageUrl, category, displayOrder, active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Image ID is required' }, { status: 400 });
    }

    const updated = await db.galleryImage.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        imageUrl: imageUrl || undefined,
        category: category || undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    try {
      await db.auditLog.create({
        data: {
          adminUsername: session.username,
          action: 'UPDATE_GALLERY_IMAGE',
          entityType: 'GalleryImage',
          entityId: updated.id,
        },
      });
    } catch (auditErr) {}

    return NextResponse.json({ success: true, galleryImage: updated });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update gallery image' },
      { status: 500 }
    );
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
      return NextResponse.json({ success: false, error: 'Image ID is required' }, { status: 400 });
    }

    await db.galleryImage.delete({
      where: { id },
    });

    try {
      await db.auditLog.create({
        data: {
          adminUsername: session.username,
          action: 'DELETE_GALLERY_IMAGE',
          entityType: 'GalleryImage',
          entityId: id,
        },
      });
    } catch (auditErr) {}

    return NextResponse.json({ success: true, message: 'Gallery image deleted' });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete gallery image' },
      { status: 500 }
    );
  }
}
