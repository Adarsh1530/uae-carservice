export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cleanPhoneNumber, generateLoyaltyId } from '@/lib/utils';
import crypto from 'crypto';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status') || 'ALL';
    const search = (searchParams.get('search') || '').trim();

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { loyaltyId: { contains: search, mode: 'insensitive' } },
        { plateNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, customers] = await Promise.all([
      db.loyaltyCustomer.count({ where }),
      db.loyaltyCustomer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { transactions: true, redemptions: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching loyalty customers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, email, plateNumber, vehicleMake, vehicleModel, vehicleYear } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Full Name and Phone Number are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = cleanPhoneNumber(phone);
    const existing = await db.loyaltyCustomer.findFirst({
      where: {
        OR: [{ phone: cleanPhone }, { phone }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Customer with mobile ${phone} already exists (ID: ${existing.loyaltyId}).` },
        { status: 409 }
      );
    }

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
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email ? email.trim() : null,
        plateNumber: plateNumber ? plateNumber.trim().toUpperCase() : null,
        vehicleMake: vehicleMake ? vehicleMake.trim() : null,
        vehicleModel: vehicleModel ? vehicleModel.trim() : null,
        vehicleYear: vehicleYear ? vehicleYear.trim() : null,
        status: 'ACTIVE',
        currentStamps: 0,
        lifetimeStamps: 0,
        currentPoints: 0,
        lifetimePoints: 0,
        qrCodeToken,
      },
    });

    await db.loyaltyTransaction.create({
      data: {
        customerId: customer.id,
        type: 'ACCOUNT_CREATED',
        amount: 0,
        balanceAfter: 0,
        adminUsername: session.username,
        notes: `Created manually by admin ${session.username}`,
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'CREATE_LOYALTY_MEMBER',
        entityType: 'LoyaltyCustomer',
        entityId: customer.id,
        metadata: JSON.stringify({ loyaltyId, phone: cleanPhone, fullName }),
      },
    });

    return NextResponse.json({
      success: true,
      customer,
      message: `Loyalty account ${loyaltyId} created successfully.`,
    });
  } catch (error) {
    console.error('Error creating loyalty member:', error);
    return NextResponse.json({ success: false, error: 'Failed to create member' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, fullName, phone, email, plateNumber, vehicleMake, vehicleModel, vehicleYear, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 });
    }

    const cleanPhone = phone ? cleanPhoneNumber(phone) : undefined;

    const updated = await db.loyaltyCustomer.update({
      where: { id },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(cleanPhone && { phone: cleanPhone }),
        ...(email !== undefined && { email: email ? email.trim() : null }),
        ...(plateNumber !== undefined && { plateNumber: plateNumber ? plateNumber.trim().toUpperCase() : null }),
        ...(vehicleMake !== undefined && { vehicleMake: vehicleMake ? vehicleMake.trim() : null }),
        ...(vehicleModel !== undefined && { vehicleModel: vehicleModel ? vehicleModel.trim() : null }),
        ...(vehicleYear !== undefined && { vehicleYear: vehicleYear ? vehicleYear.trim() : null }),
        ...(status && { status }),
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'UPDATE_LOYALTY_MEMBER',
        entityType: 'LoyaltyCustomer',
        entityId: id,
        metadata: JSON.stringify({ status, fullName, plateNumber }),
      },
    });

    return NextResponse.json({
      success: true,
      customer: updated,
      message: 'Member updated successfully.',
    });
  } catch (error) {
    console.error('Error updating loyalty member:', error);
    return NextResponse.json({ success: false, error: 'Failed to update member' }, { status: 500 });
  }
}
