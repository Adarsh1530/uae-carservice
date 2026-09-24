export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cleanPhoneNumber, buildLoyaltyWhatsAppUrl } from '@/lib/utils';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = (body.identifier || body.query || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please enter your mobile number or Loyalty ID (e.g. WG-VIP-1029).' },
        { status: 400 }
      );
    }

    const cleanPhone = cleanPhoneNumber(query);

    const customer = await db.loyaltyCustomer.findFirst({
      where: {
        OR: [
          { loyaltyId: { equals: query, mode: 'insensitive' } },
          { phone: cleanPhone || query },
          { phone: query },
          { plateNumber: { equals: query.toUpperCase(), mode: 'insensitive' } },
        ],
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        redemptions: {
          orderBy: { redeemedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: `No loyalty account found for "${query}". Please check the phone number/ID or register for a free VIP Pass.`,
        },
        { status: 404 }
      );
    }

    const config = await db.loyaltyProgramConfig.findUnique({ where: { id: 'default' } });
    const stampsPerReward = config?.stampsPerReward || 4;
    const rewardTitle = config?.rewardTitle || '1 FREE BESPOKE FINISH';

    // Generate SVG QR code
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://walessgroup.ae';
    const qrDataPayload = `${siteUrl}/loyalty/verify?token=${customer.qrCodeToken}&id=${customer.loyaltyId}`;
    const qrSvg = await QRCode.toString(qrDataPayload, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#00FF66',
        light: '#00000000',
      },
    });

    const whatsappUrl = buildLoyaltyWhatsAppUrl({
      fullName: customer.fullName,
      phone: customer.phone,
      loyaltyId: customer.loyaltyId,
      currentStamps: customer.currentStamps,
      stampsPerReward,
      rewardTitle,
      cardUrl: `${siteUrl}/loyalty?lookup=${customer.loyaltyId}`,
    });

    // Check if customer currently qualifies for rewards
    const allRewards = await db.loyaltyReward.findMany({
      where: { isActive: true },
      orderBy: { requiredStamps: 'asc' },
    });

    const unlockedRewards = allRewards.filter(r => customer.currentStamps >= r.requiredStamps);

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        qrSvg,
        whatsappUrl,
      },
      config,
      unlockedRewards,
      allRewards,
    });
  } catch (error) {
    console.error('Error looking up loyalty member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to look up loyalty card' },
      { status: 500 }
    );
  }
}
