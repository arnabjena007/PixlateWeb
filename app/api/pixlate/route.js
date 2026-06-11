import { NextResponse } from 'next/server';
import { processPixelate } from '@/lib/pixelate-processor';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    const width = parseInt(formData.get('width')) || 800;
    const height = parseInt(formData.get('height')) || 800;
    const whitePercent = parseInt(formData.get('whitePercent')) || 0;
    const colorSort = formData.get('colorSort') === 'true';
    const random = parseInt(formData.get('random')) || 0;
    const reverse = formData.get('reverse') === 'true';
    const sweep = formData.get('sweep') === 'true';
    const randomSeed = parseInt(formData.get('randomSeed')) || 0;
    const compress = parseInt(formData.get('compress')) || 0;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image using serverless processor
    const outputBuffer = await processPixelate(buffer, {
      width,
      height,
      whitePercent,
      colorSort,
      random,
      reverse,
      sweep,
      randomSeed,
      compress,
    });

    return new NextResponse(outputBuffer, {
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image: ' + error.message },
      { status: 500 }
    );
  }
}