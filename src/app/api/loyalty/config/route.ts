export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let config = await db.loyaltyProgramConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await db.loyaltyProgramConfig.create({
        data: {
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
    }

    const activeRewards = await db.loyaltyReward.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      config,
      rewards: activeRewards,
    });
  } catch (error) {
    console.error('Error fetching loyalty config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load loyalty configuration' },
      { status: 500 }
    );
  }
}
