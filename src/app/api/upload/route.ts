import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file arrayBuffer to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a clean filename
    const ext = file.name.split('.').pop() || 'png';
    const baseName = file.name
      .toLowerCase()
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/[^a-z0-9]/g, '_');
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanFilename = `${baseName}_${uniqueSuffix}.${ext}`;
    
    // Save to the public directory
    const publicPath = join(process.cwd(), 'public', cleanFilename);
    await writeFile(publicPath, buffer);

    return NextResponse.json({ 
      success: true, 
      path: `/${cleanFilename}` 
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}
