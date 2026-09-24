export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateRedemptionCode, cleanPhoneNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { customerId, rewardId, serviceReference, notes } = body;

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID is required' }, { status: 400 });
    }

    const customer = await db.loyaltyCustomer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    if (customer.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Customer account is not active.' },
        { status: 403 }
      );
    }

    // Find requested reward or default config reward
    let targetReward: any = null;
    if (rewardId) {
      targetReward = await db.loyaltyReward.findUnique({ where: { id: rewardId } });
    }

    if (!targetReward) {
      // Fallback to first active reward or create from config
      const config = await db.loyaltyProgramConfig.findUnique({ where: { id: 'default' } });
      const firstActive = await db.loyaltyReward.findFirst({ where: { isActive: true }, orderBy: { requiredStamps: 'asc' } });
      targetReward = firstActive || {
        id: 'rew_free_finish',
        title: config?.rewardTitle || '1 FREE BESPOKE FINISH',
        requiredStamps: config?.stampsPerReward || 4,
      };
    }

    const requiredStamps = targetReward.requiredStamps || 4;

    if (customer.currentStamps < requiredStamps) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient stamps. Customer has ${customer.currentStamps} stamp(s), but this reward requires ${requiredStamps} stamps.`,
        },
        { status: 400 }
      );
    }

    // Generate unique redemption code
    let redemptionCode = generateRedemptionCode();
    let collision = await db.loyaltyRedemption.findUnique({ where: { redemptionCode } });
    while (collision) {
      redemptionCode = generateRedemptionCode();
      collision = await db.loyaltyRedemption.findUnique({ where: { redemptionCode } });
    }

    const newCurrentStamps = customer.currentStamps - requiredStamps;

    // Execute atomic transaction: deduct stamps, increment reward count, create redemption record, create ledger entry
    const [updatedCustomer, redemption, transaction] = await db.$transaction([
      db.loyaltyCustomer.update({
        where: { id: customerId },
        data: { currentStamps: newCurrentStamps },
      }),
      db.loyaltyRedemption.create({
        data: {
          redemptionCode,
          customerId,
          rewardId: targetReward.id,
          rewardTitle: targetReward.title,
          status: 'COMPLETED',
          serviceReference: serviceReference || null,
          adminUsername: session.username,
          notes: notes || `Redeemed ${targetReward.title} by staff ${session.username}`,
        },
      }),
      db.loyaltyTransaction.create({
        data: {
          customerId,
          type: 'REWARD_REDEEMED',
          amount: -requiredStamps,
          balanceAfter: newCurrentStamps,
          serviceName: targetReward.title,
          serviceReference: serviceReference || redemptionCode,
          adminUsername: session.username,
          notes: `Voucher Code: ${redemptionCode}`,
        },
      }),
      db.loyaltyReward.update({
        where: { id: targetReward.id },
        data: { redemptionCount: { increment: 1 } },
      }),
    ]);

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'REDEEM_LOYALTY_REWARD',
        entityType: 'LoyaltyRedemption',
        entityId: redemption.id,
        metadata: JSON.stringify({
          redemptionCode,
          rewardTitle: targetReward.title,
          deductedStamps: requiredStamps,
          remainingStamps: newCurrentStamps,
        }),
      },
    });

    // Build notification WhatsApp URL
    const cleanPhone = cleanPhoneNumber(customer.phone);
    const notificationText = `🎉 *CONGRATULATIONS FROM WALESS GROUP!* 🎉

Hello ${customer.fullName},
Your reward has been successfully redeemed at our workshop!

🎁 *Reward Claimed:* ${targetReward.title}
🎫 *Redemption Voucher Code:* ${redemptionCode}
⭐ *Remaining Stamps:* ${newCurrentStamps}
📅 *Date:* ${new Date().toLocaleDateString('en-AE')}

Thank you for being a valued VIP client.
WALESS GROUP | Ras Al Khaimah, UAE
📞 +971 7 222 868 | 🌐 walessgroup.ae`;

    const whatsappNotifyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(notificationText)}`;

    return NextResponse.json({
      success: true,
      message: `Reward "${targetReward.title}" successfully redeemed! Voucher Code: ${redemptionCode}`,
      redemption,
      customer: updatedCustomer,
      whatsappNotifyUrl,
    });
  } catch (error) {
    console.error('Error redeeming loyalty reward:', error);
    return NextResponse.json({ success: false, error: 'Failed to process redemption' }, { status: 500 });
  }
}
