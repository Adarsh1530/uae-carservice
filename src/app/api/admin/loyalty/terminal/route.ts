export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cleanPhoneNumber } from '@/lib/utils';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const query = (body.query || body.code || body.token || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please scan a QR code or enter Member ID / Phone number.' },
        { status: 400 }
      );
    }

    const cleanPhone = cleanPhoneNumber(query);

    const customer = await db.loyaltyCustomer.findFirst({
      where: {
        OR: [
          { qrCodeToken: query },
          { loyaltyId: { equals: query, mode: 'insensitive' } },
          { phone: cleanPhone || query },
          { phone: query },
          { plateNumber: { equals: query.toUpperCase(), mode: 'insensitive' } },
        ],
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        redemptions: {
          orderBy: { redeemedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: `No customer record found matching "${query}".` },
        { status: 404 }
      );
    }

    const [config, services, rewards] = await Promise.all([
      db.loyaltyProgramConfig.findUnique({ where: { id: 'default' } }),
      db.service.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { displayOrder: 'asc' },
      }),
      db.loyaltyReward.findMany({
        where: { isActive: true },
        orderBy: { requiredStamps: 'asc' },
      }),
    ]);

    // Generate SVG QR code string
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://walessgroup.ae';
    const qrDataPayload = `${siteUrl}/loyalty/verify?token=${customer.qrCodeToken}&id=${customer.loyaltyId}`;
    const qrSvg = await QRCode.toString(qrDataPayload, {
      type: 'svg',
      margin: 1,
      color: { dark: '#00FF66', light: '#00000000' },
    });

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        qrSvg,
      },
      config,
      services,
      rewards,
    });
  } catch (error) {
    console.error('Terminal verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal verification failure' }, { status: 500 });
  }
}
