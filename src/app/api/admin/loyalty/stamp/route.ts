export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildLoyaltyWhatsAppUrl } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { customerId, amount = 1, serviceName, serviceReference, notes } = body;

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID is required' }, { status: 400 });
    }

    const stampDiff = parseInt(amount, 10);
    if (isNaN(stampDiff) || stampDiff === 0) {
      return NextResponse.json({ success: false, error: 'Stamp amount must be a non-zero integer' }, { status: 400 });
    }

    const customer = await db.loyaltyCustomer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    if (customer.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Cannot add stamps to a SUSPENDED loyalty account.' },
        { status: 403 }
      );
    }

    const newCurrentStamps = Math.max(0, customer.currentStamps + stampDiff);
    const newLifetimeStamps = stampDiff > 0 ? customer.lifetimeStamps + stampDiff : customer.lifetimeStamps;

    const actionType = stampDiff > 0 ? 'STAMP_EARNED' : 'STAMP_DEDUCTED';

    // Perform database update & transaction logging in atomic transaction
    const [updatedCustomer, transaction] = await db.$transaction([
      db.loyaltyCustomer.update({
        where: { id: customerId },
        data: {
          currentStamps: newCurrentStamps,
          lifetimeStamps: newLifetimeStamps,
        },
      }),
      db.loyaltyTransaction.create({
        data: {
          customerId,
          type: actionType,
          amount: stampDiff,
          balanceAfter: newCurrentStamps,
          serviceName: serviceName || 'Automotive Service',
          serviceReference: serviceReference || null,
          adminUsername: session.username,
          notes: notes || (stampDiff > 0 ? `+${stampDiff} service stamp awarded` : `${stampDiff} stamps manual adjustment`),
        },
      }),
    ]);

    // Create audit log
    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'LOYALTY_STAMP_ACTION',
        entityType: 'LoyaltyCustomer',
        entityId: customerId,
        metadata: JSON.stringify({
          amount: stampDiff,
          newBalance: newCurrentStamps,
          service: serviceName,
          ref: serviceReference,
        }),
      },
    });

    // Check if new balance qualifies for reward
    const config = await db.loyaltyProgramConfig.findUnique({ where: { id: 'default' } });
    const stampsPerReward = config?.stampsPerReward || 4;
    const isRewardUnlocked = newCurrentStamps >= stampsPerReward;

    const whatsappUrl = buildLoyaltyWhatsAppUrl({
      fullName: updatedCustomer.fullName,
      phone: updatedCustomer.phone,
      loyaltyId: updatedCustomer.loyaltyId,
      currentStamps: updatedCustomer.currentStamps,
      stampsPerReward,
      rewardTitle: config?.rewardTitle,
    });

    return NextResponse.json({
      success: true,
      message: `${stampDiff > 0 ? `+${stampDiff} stamp(s) added successfully.` : `${stampDiff} stamp(s) adjusted.`}`,
      customer: {
        ...updatedCustomer,
        whatsappUrl,
      },
      transaction,
      isRewardUnlocked,
    });
  } catch (error) {
    console.error('Error modifying customer stamps:', error);
    return NextResponse.json({ success: false, error: 'Failed to process stamp action' }, { status: 500 });
  }
}
