import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 1 * 1024 * 1024; 
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 1 MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    const vpsResponse = await fetch('http://72.61.17.107/uploads/upload.php', {
      method: 'POST',
      body: formData,
    });

    const data = await vpsResponse.json();

    if (!vpsResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'VPS failed to store file.' },
        { status: vpsResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: data.imageUrl,
    });
  } catch (error) {
    console.error('Local Bridge Upload Error:', error);
    return NextResponse.json(
      { error: 'Could not connect to remote upload server.' },
      { status: 500 }
    );
  }
}