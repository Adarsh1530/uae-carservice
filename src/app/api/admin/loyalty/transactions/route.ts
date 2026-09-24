export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const type = searchParams.get('type') || 'ALL';
    const customerId = searchParams.get('customerId');

    const where: any = {};
    if (type !== 'ALL') {
      where.type = type;
    }
    if (customerId) {
      where.customerId = customerId;
    }

    const [total, transactions] = await Promise.all([
      db.loyaltyTransaction.count({ where }),
      db.loyaltyTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: {
            select: {
              fullName: true,
              phone: true,
              loyaltyId: true,
              plateNumber: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching loyalty transactions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch transaction ledger' }, { status: 500 });
  }
}
