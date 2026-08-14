export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';

    const session = await getAdminSession();
    const showAll = includeInactive && session !== null;

    const services = await db.service.findMany({
      where: showAll ? {} : { active: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Parse JSON string fields
    const parsed = services.map((s) => ({
      ...s,
      additionalImages: JSON.parse(s.additionalImages || '[]'),
      features: JSON.parse(s.features || '[]'),
    }));

    return NextResponse.json({ success: true, services: parsed });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, shortDesc, detailedDesc, mainImage, additionalImages, features, priceInfo, displayOrder, active } = body;

    if (!name || !shortDesc || !detailedDesc || !mainImage) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const generatedSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const created = await db.service.create({
      data: {
        name,
        slug: generatedSlug,
        shortDesc,
        detailedDesc,
        mainImage,
        additionalImages: JSON.stringify(Array.isArray(additionalImages) ? additionalImages : []),
        features: JSON.stringify(Array.isArray(features) ? features : []),
        priceInfo: priceInfo || null,
        displayOrder: parseInt(displayOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'CREATE_SERVICE',
        entityType: 'Service',
        entityId: created.id,
        metadata: JSON.stringify({ name: created.name }),
      },
    });

    return NextResponse.json({ success: true, service: created });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, shortDesc, detailedDesc, mainImage, additionalImages, features, priceInfo, displayOrder, active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 });
    }

    const updated = await db.service.update({
      where: { id },
      data: {
        name,
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined,
        shortDesc,
        detailedDesc,
        mainImage,
        additionalImages: Array.isArray(additionalImages) ? JSON.stringify(additionalImages) : undefined,
        features: Array.isArray(features) ? JSON.stringify(features) : undefined,
        priceInfo,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'UPDATE_SERVICE',
        entityType: 'Service',
        entityId: updated.id,
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 });
    }

    await db.service.delete({
      where: { id },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'DELETE_SERVICE',
        entityType: 'Service',
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
