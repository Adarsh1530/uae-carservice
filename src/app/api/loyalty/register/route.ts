export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cleanPhoneNumber, generateLoyaltyId, buildLoyaltyWhatsAppUrl } from '@/lib/utils';
import { z } from 'zod';
import crypto from 'crypto';
import QRCode from 'qrcode';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  phone: z.string().min(8, 'A valid mobile number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  plateNumber: z.string().optional().or(z.literal('')),
  vehicleMake: z.string().optional().or(z.literal('')),
  vehicleModel: z.string().optional().or(z.literal('')),
  vehicleYear: z.string().optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const cleanPhone = cleanPhoneNumber(validated.phone);
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid UAE mobile number (e.g. 050 123 4567 or +971 50 123 4567).' },
        { status: 400 }
      );
    }

    // Check for duplicate account with same phone
    const existing = await db.loyaltyCustomer.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { phone: validated.phone },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `An active loyalty pass is already registered with mobile number ${validated.phone}. Please use "Access My Card" with your phone number to view your pass.`,
          existingLoyaltyId: existing.loyaltyId,
        },
        { status: 409 }
      );
    }

    // Generate unique loyalty ID and QR code token
    let loyaltyId = generateLoyaltyId();
    let collision = await db.loyaltyCustomer.findUnique({ where: { loyaltyId } });
    while (collision) {
      loyaltyId = generateLoyaltyId();
      collision = await db.loyaltyCustomer.findUnique({ where: { loyaltyId } });
    }

    const qrCodeToken = crypto.randomBytes(16).toString('hex');

    const customer = await db.loyaltyCustomer.create({
      data: {
        loyaltyId,
        fullName: validated.fullName.trim(),
        phone: cleanPhone,
        email: validated.email ? validated.email.trim() : null,
        plateNumber: validated.plateNumber ? validated.plateNumber.trim().toUpperCase() : null,
        vehicleMake: validated.vehicleMake ? validated.vehicleMake.trim() : null,
        vehicleModel: validated.vehicleModel ? validated.vehicleModel.trim() : null,
        vehicleYear: validated.vehicleYear ? validated.vehicleYear.trim() : null,
        status: 'ACTIVE',
        currentStamps: 0,
        lifetimeStamps: 0,
        currentPoints: 0,
        lifetimePoints: 0,
        qrCodeToken,
      },
    });

    // Record initial ledger transaction
    await db.loyaltyTransaction.create({
      data: {
        customerId: customer.id,
        type: 'ACCOUNT_CREATED',
        amount: 0,
        balanceAfter: 0,
        notes: 'Customer self-registered for WALESS VIP Loyalty Pass',
      },
    });

    // Fetch config for WhatsApp and response details
    const config = await db.loyaltyProgramConfig.findUnique({ where: { id: 'default' } });
    const stampsPerReward = config?.stampsPerReward || 4;
    const rewardTitle = config?.rewardTitle || '1 FREE BESPOKE FINISH';

    // Generate SVG QR code
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://walessgroup.ae';
    const qrDataPayload = `${siteUrl}/loyalty/verify?token=${qrCodeToken}&id=${loyaltyId}`;
    const qrSvg = await QRCode.toString(qrDataPayload, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#00FF66',
        light: '#00000000', // transparent background
      },
    });

    const whatsappUrl = buildLoyaltyWhatsAppUrl({
      fullName: customer.fullName,
      phone: customer.phone,
      loyaltyId: customer.loyaltyId,
      currentStamps: 0,
      stampsPerReward,
      rewardTitle,
      cardUrl: `${siteUrl}/loyalty?lookup=${customer.loyaltyId}`,
    });

    return NextResponse.json({
      success: true,
      message: 'VIP Loyalty Pass successfully generated!',
      customer: {
        ...customer,
        qrSvg,
        whatsappUrl,
      },
      config,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    console.error('Error registering loyalty customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create loyalty account. Please try again.' },
      { status: 500 }
    );
  }
}
