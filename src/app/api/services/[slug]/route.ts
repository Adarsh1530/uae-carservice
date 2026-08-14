import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await db.service.findUnique({
      where: { slug: params.slug },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const parsed = {
      ...service,
      additionalImages: JSON.parse(service.additionalImages || '[]'),
      features: JSON.parse(service.features || '[]'),
    };

    return NextResponse.json({ success: true, service: parsed });
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
