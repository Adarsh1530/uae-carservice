export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { generateBookingReferenceId } from '@/lib/utils';
import { z } from 'zod';

const bookingSchema = z.object({
  serviceId: z.string().optional().nullable(),
  serviceName: z.string().min(1, 'Service name is required'),
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  address: z.string().min(3, 'Address is required'),
  phone: z.string().min(5, 'Valid Phone number is required'),
  requestedDate: z.string().min(1, 'Date is required'),
  description: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = bookingSchema.parse(body);

    const bookingDate = new Date(validated.requestedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid future booking date.' },
        { status: 400 }
      );
    }

    const referenceId = await generateBookingReferenceId();

    const created = await db.booking.create({
      data: {
        referenceId,
        clientName: validated.fullName,
        clientEmail: 'client@walessgroup.ae',
        clientPhone: validated.phone,
        clientAddress: validated.address,
        serviceName: validated.serviceName,
        preferredDate: validated.requestedDate,
        specialNotes: validated.description || null,
        status: 'PENDING',
      },
    });

    const responseBooking = {
      id: created.id,
      referenceId: created.referenceId,
      fullName: created.clientName,
      phone: created.clientPhone,
      address: created.clientAddress,
      serviceName: created.serviceName,
      requestedDate: created.preferredDate,
      description: created.specialNotes,
      status: created.status,
      createdAt: created.createdAt,
    };

    return NextResponse.json({
      success: true,
      booking: responseBooking,
      message: 'Booking successfully submitted.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error creating booking' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search && search.trim() !== '') {
      const query = search.trim();
      where.OR = [
        { referenceId: { contains: query } },
        { clientName: { contains: query } },
        { clientPhone: { contains: query } },
        { serviceName: { contains: query } },
      ];
    }

    let rawBookings: any[] = [];
    let total = 0;
    try {
      [rawBookings, total] = await Promise.all([
        db.booking.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.booking.count({ where }),
      ]);
    } catch (e) {
      console.warn('DB bookings fetch fallback:', e);
    }

    const bookings = rawBookings.map((b) => ({
      id: b.id,
      referenceId: b.referenceId,
      fullName: b.clientName,
      phone: b.clientPhone,
      address: b.clientAddress,
      serviceName: b.serviceName,
      requestedDate: b.preferredDate,
      description: b.specialNotes,
      status: b.status,
      rejectionReason: b.rejectionReason,
      createdAt: b.createdAt,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'Missing booking ID or action' }, { status: 400 });
    }

    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    let updateData: any = {};

    if (action === 'ACCEPT') {
      updateData = {
        status: 'ACCEPTED',
      };
    } else if (action === 'REJECT') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return NextResponse.json({ success: false, error: 'Rejection reason is required' }, { status: 400 });
      }
      updateData = {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      };
    } else if (['CANCELLED', 'COMPLETED', 'PENDING'].includes(action)) {
      updateData = { status: action };
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const updated = await db.booking.update({
      where: { id },
      data: updateData,
    });

    try {
      await db.auditLog.create({
        data: {
          adminUsername: session.username,
          action: `BOOKING_${action}`,
          entityType: 'Booking',
          entityId: id,
          metadata: JSON.stringify({ referenceId: booking.referenceId, action, rejectionReason }),
        },
      });
    } catch (auditErr) {}

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update booking status' }, { status: 500 });
  }
}
