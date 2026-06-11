import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    const width = formData.get('width') || '800';
    const height = formData.get('height') || '800';
    const whitePercent = formData.get('whitePercent');
    const colorSort = formData.get('colorSort') === 'true'; // bool - maps to -colorsort int (use default if false)
    const random = parseInt(formData.get('random') || '0'); // int weight
    const reverse = formData.get('reverse') === 'true'; // boolean flag
    const sweep = formData.get('sweep') === 'true'; // boolean flag
    const randomSeedRaw = formData.get('randomSeed');
    const randomSeed = parseInt(randomSeedRaw) || 0; // int seed value
    const variations = formData.get('variations');
    const compress = formData.get('compress');
    const seeds = formData.get('seeds');

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sniff image format from magic bytes (file signature)
    let ext = '.jpg'; // default fallback
    if (buffer.length >= 4) {
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        ext = '.png';
      } else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        ext = '.jpg';
      } else {
        // Fallback to original file name extension if magic bytes don't match
        const originalName = file.name || 'image.jpg';
        const fileExt = path.extname(originalName).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(fileExt)) {
          ext = fileExt;
        }
      }
    }
    
    // Create a temporary directory for processing
    const tmpDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    
    const inputPath = path.join(tmpDir, `input-${Date.now()}${ext}`);
    const outputPath = path.join(tmpDir, `output-${Date.now()}.png`);
    
    await fs.writeFile(inputPath, buffer);

    // Locate the Go binary (using absolute path for Windows compatibility)
    const binaryPath = path.join(process.cwd(), 'pix.exe');

    // Build the CLI execution string
    let cmd = `"${binaryPath}" -in "${inputPath}" -out "${outputPath}" -width ${width} -height ${height}`;
    
    if (whitePercent) cmd += ` -white-percent ${whitePercent}`;
    if (colorSort) cmd += ' -colorsort 90'; // default colorsort weight when enabled
    if (random > 0) cmd += ` -random ${random}`;
    if (reverse) cmd += ' -reverse';
    if (sweep) cmd += ' -sweep';
    if (randomSeed > 0) cmd += ` -random-seed ${randomSeed}`;
    if (variations && parseInt(variations) > 1) cmd += ` -variations ${variations}`;
    if (compress) cmd += ` -compress ${compress}`;
    if (seeds && seeds.trim()) cmd += ` -seeds "${seeds.replace(/"/g, '\\"')}"`;

    // Execute the Go binary
    await execAsync(cmd);

    // Read the final processed image
    const outputBuffer = await fs.readFile(outputPath);

    // Clean up temporary files asynchronously
    await fs.unlink(inputPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});

    return new NextResponse(outputBuffer, {
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process image: ' + error.message }, { status: 500 });
  }
}
