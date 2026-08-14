import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'General';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Allowed: JPG, PNG, WEBP, AVIF, SVG' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 15MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.jpg';
    const timestamp = Date.now();
    const cleanBase = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const filename = `${cleanBase}_${timestamp}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${filename}`;

    const media = await db.media.create({
      data: {
        filename: file.name,
        url,
        size: file.size,
        mimeType: file.type,
        category,
      },
    });

    await db.auditLog.create({
      data: {
        adminUsername: session.username,
        action: 'UPLOAD_MEDIA',
        entityType: 'Media',
        entityId: media.id,
        metadata: JSON.stringify({ filename: file.name, url }),
      },
    });

    return NextResponse.json({ success: true, url, media });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}
