export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';

    // 1. Try writing to local public/uploads directory (works in local dev)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}_${sanitizedFilename}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsError) {
      // 2. Vercel Serverless environment has read-only filesystem -> Fall back to high-res Data URI
      const mimeType = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

    // 3. Save to Media Library table in database
    try {
      await db.media.create({
        data: {
          filename: file.name,
          url: publicUrl,
          mimeType: file.type || 'image/jpeg',
          size: file.size,
        },
      });
    } catch (dbErr) {
      console.warn('Media DB record warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
