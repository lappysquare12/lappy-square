import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // If multipart form data (file from input)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'lappy-square/uploads';
      const resourceType = (formData.get('resource_type') as 'auto' | 'image' | 'video') || 'auto';

      if (!file) {
        return NextResponse.json({ error: 'No media file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadImageToCloudinary(buffer, folder, resourceType);

      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        resource_type: result.resource_type,
      });
    }

    // If JSON with base64 data
    const body = await req.json();
    if (body.image || body.file) {
      const folder = body.folder || 'lappy-square/uploads';
      const resourceType = body.resource_type || 'auto';
      const result = await uploadImageToCloudinary(body.image || body.file, folder, resourceType);
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        resource_type: result.resource_type,
      });
    }

    return NextResponse.json({ error: 'Invalid upload request. Send file or base64 data.' }, { status: 400 });
  } catch (error: any) {
    console.error('Cloudinary upload API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload media to Cloudinary' },
      { status: 500 }
    );
  }
}
