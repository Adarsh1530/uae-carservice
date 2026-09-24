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

    const [
      totalMembers,
      activeMembers,
      totalRewards,
      totalRedemptions,
      recentTransactions,
      recentRedemptions,
      config,
    ] = await Promise.all([
      db.loyaltyCustomer.count(),
      db.loyaltyCustomer.count({ where: { status: 'ACTIVE' } }),
      db.loyaltyReward.count({ where: { isActive: true } }),
      db.loyaltyRedemption.count(),
      db.loyaltyTransaction.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { fullName: true, phone: true, loyaltyId: true },
          },
        },
      }),
      db.loyaltyRedemption.findMany({
        take: 5,
        orderBy: { redeemedAt: 'desc' },
        include: {
          customer: {
            select: { fullName: true, phone: true, loyaltyId: true },
          },
        },
      }),
      db.loyaltyProgramConfig.findUnique({ where: { id: 'default' } }),
    ]);

    // Aggregate lifetime stamps
    const aggregate = await db.loyaltyCustomer.aggregate({
      _sum: {
        currentStamps: true,
        lifetimeStamps: true,
      },
    });

    const stats = {
      totalMembers,
      activeMembers,
      totalRewards,
      totalRedemptions,
      totalActiveStamps: aggregate._sum.currentStamps || 0,
      totalLifetimeStamps: aggregate._sum.lifetimeStamps || 0,
    };

    return NextResponse.json({
      success: true,
      stats,
      config,
      recentTransactions,
      recentRedemptions,
    });
  } catch (error) {
    console.error('Error loading admin loyalty dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load loyalty metrics' },
      { status: 500 }
    );
  }
}
