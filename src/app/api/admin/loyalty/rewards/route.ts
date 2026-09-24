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

    const rewards = await db.loyaltyReward.findMany({
      orderBy: [{ displayOrder: 'asc' }, { requiredStamps: 'asc' }],
      include: {
        _count: { select: { redemptions: true } },
      },
    });

    return NextResponse.json({ success: true, rewards });
  } catch (error) {
    console.error('Error fetching admin rewards:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rewards' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, requiredStamps = 4, requiredPoints = 0, validDays = 90, displayOrder = 0 } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Reward Title and Description are required' }, { status: 400 });
    }

    const reward = await db.loyaltyReward.create({
      data: {
        title: title.trim().toUpperCase(),
        description: description.trim(),
        requiredStamps: parseInt(requiredStamps, 10) || 4,
        requiredPoints: parseInt(requiredPoints, 10) || 0,
        validDays: parseInt(validDays, 10) || 90,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive: true,
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'CREATE_LOYALTY_REWARD',
        entityType: 'LoyaltyReward',
        entityId: reward.id,
        metadata: JSON.stringify({ title, requiredStamps }),
      },
    });

    return NextResponse.json({ success: true, reward, message: 'Reward created successfully.' });
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json({ success: false, error: 'Failed to create reward' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, requiredStamps, requiredPoints, validDays, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Reward ID is required' }, { status: 400 });
    }

    const updated = await db.loyaltyReward.update({
      where: { id },
      data: {
        ...(title && { title: title.trim().toUpperCase() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(requiredStamps !== undefined && { requiredStamps: parseInt(requiredStamps, 10) }),
        ...(requiredPoints !== undefined && { requiredPoints: parseInt(requiredPoints, 10) }),
        ...(validDays !== undefined && { validDays: parseInt(validDays, 10) }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'UPDATE_LOYALTY_REWARD',
        entityType: 'LoyaltyReward',
        entityId: id,
        metadata: JSON.stringify({ title: updated.title, isActive: updated.isActive }),
      },
    });

    return NextResponse.json({ success: true, reward: updated, message: 'Reward updated successfully.' });
  } catch (error) {
    console.error('Error updating reward:', error);
    return NextResponse.json({ success: false, error: 'Failed to update reward' }, { status: 500 });
  }
}
