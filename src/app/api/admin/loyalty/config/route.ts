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

    const config = await db.loyaltyProgramConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        programName: 'WALESS VIP LOYALTY PASS',
        programTagline: 'BUY 4 SERVICES = 1 FREE BESPOKE FINISH',
        isActive: true,
        rewardMode: 'STAMPS',
        stampsPerReward: 4,
        stampsPerVisit: 1,
        rewardExpiryDays: 365,
        rewardTitle: '1 FREE BESPOKE FINISH',
        rewardDescription: 'Enjoy a complimentary bespoke finish or luxury detailing service after collecting 4 service stamps.',
        termsConditions: '• Present your digital loyalty pass or member ID upon vehicle arrival at WALESS GROUP.\n• Receive 1 stamp for each qualifying service or maintenance visit.\n• Redeem your free reward once the required stamps have been accumulated.\n• Valid exclusively at WALESS GROUP Al Dhait South, Ras Al Khaimah, UAE.\n• Passes and rewards are non-transferable, cannot be redeemed for cash, and cannot be combined with conflicting promotional discounts.',
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching admin loyalty config:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      programName,
      programTagline,
      isActive,
      rewardMode,
      stampsPerReward,
      stampsPerVisit,
      rewardExpiryDays,
      rewardTitle,
      rewardDescription,
      termsConditions,
    } = body;

    const updated = await db.loyaltyProgramConfig.upsert({
      where: { id: 'default' },
      update: {
        ...(programName && { programName: programName.trim() }),
        ...(programTagline !== undefined && { programTagline: programTagline.trim() }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(rewardMode && { rewardMode }),
        ...(stampsPerReward !== undefined && { stampsPerReward: Math.max(1, parseInt(stampsPerReward, 10)) }),
        ...(stampsPerVisit !== undefined && { stampsPerVisit: Math.max(1, parseInt(stampsPerVisit, 10)) }),
        ...(rewardExpiryDays !== undefined && { rewardExpiryDays: Math.max(0, parseInt(rewardExpiryDays, 10)) }),
        ...(rewardTitle !== undefined && { rewardTitle: rewardTitle.trim() }),
        ...(rewardDescription !== undefined && { rewardDescription: rewardDescription.trim() }),
        ...(termsConditions !== undefined && { termsConditions: termsConditions.trim() }),
      },
      create: {
        id: 'default',
        programName: programName || 'WALESS VIP LOYALTY PASS',
        programTagline: programTagline || 'BUY 4 SERVICES = 1 FREE BESPOKE FINISH',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        rewardMode: rewardMode || 'STAMPS',
        stampsPerReward: stampsPerReward ? parseInt(stampsPerReward, 10) : 4,
        stampsPerVisit: stampsPerVisit ? parseInt(stampsPerVisit, 10) : 1,
        rewardExpiryDays: rewardExpiryDays ? parseInt(rewardExpiryDays, 10) : 365,
        rewardTitle: rewardTitle || '1 FREE BESPOKE FINISH',
        rewardDescription: rewardDescription || '',
        termsConditions: termsConditions || '',
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'UPDATE_LOYALTY_CONFIG',
        entityType: 'LoyaltyProgramConfig',
        entityId: 'default',
        metadata: JSON.stringify({
          stampsPerReward: updated.stampsPerReward,
          rewardTitle: updated.rewardTitle,
          isActive: updated.isActive,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      config: updated,
      message: 'Loyalty program rules successfully updated.',
    });
  } catch (error) {
    console.error('Error updating loyalty config:', error);
    return NextResponse.json({ success: false, error: 'Failed to update rules' }, { status: 500 });
  }
}
