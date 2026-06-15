import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// Seeded random number generator helper
function seededRandom(seed) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate scattered seed points using a simplified Poisson-disc approach
function generatePoissonSeeds(width, height, numPoints = 12, seed = 0) {
  const rng = seededRandom(seed);
  const points = [];
  const minDistance = Math.min(width, height) / 5;
  
  // Try to place points randomly but spaced out
  for (let attempt = 0; attempt < 200 && points.length < numPoints; attempt++) {
    const x = Math.floor(rng() * (width - 40)) + 20;
    const y = Math.floor(rng() * (height - 40)) + 20;
    
    let ok = true;
    for (const p of points) {
      const dist = Math.hypot(x - p.x, y - p.y);
      if (dist < minDistance) {
        ok = false;
        break;
      }
    }
    if (ok) {
      points.push({ x, y });
    }
  }
  
  // Fallback to a nice layout if we couldn't generate enough points
  if (points.length < 4) {
    const cols = 3;
    const rows = 3;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip the center (which is standard) to make it distinct
        if (r === 1 && c === 1) continue;
        const x = Math.floor((c + 0.5) * (width / cols) + (rng() - 0.5) * (width / (cols * 2)));
        const y = Math.floor((r + 0.5) * (height / rows) + (rng() - 0.5) * (height / (rows * 2)));
        points.push({ x, y });
      }
    }
  }
  
  return points.map(p => `${p.x} ${p.y}`).join(' ');
}


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
    const tmpDir = path.join(os.tmpdir(), 'pixlate-tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    
    const inputPath = path.join(tmpDir, `input-${Date.now()}${ext}`);
    const outputPath = path.join(tmpDir, `output-${Date.now()}.png`);
    
    await fs.writeFile(inputPath, buffer);

    // Locate the Go binary — platform-aware naming
    const isWin = process.platform === 'win32';
    const binaryName = isWin ? 'pix.exe' : 'pix';
    const binaryPath = path.join(process.cwd(), binaryName);

    // Guard: check if the binary exists (it won't on Vercel / serverless)
    try {
      await fs.access(binaryPath);
    } catch {
      return NextResponse.json(
        { error: 'Processing engine not available in this environment. Run locally with pix.exe for full functionality.' },
        { status: 501 }
      );
    }

    // Parse variation mode and map it to Go binary flags
    let finalSeeds = seeds || '';
    let finalRandom = random;
    let finalColorSort = colorSort;

    const variationMode = variations ? parseInt(variations) : 1;
    if (variationMode === 2) {
      // Two Seed Points: opposite corners of the canvas
      const w = parseInt(width) || 800;
      const h = parseInt(height) || 800;
      finalSeeds = `0 0 ${w - 1} ${h - 1}`;
    } else if (variationMode === 7) {
      // Average Selection: random shuffle and colors sorted by similarity
      finalColorSort = true;
      if (finalRandom === 0) {
        finalRandom = 10;
      }
    } else if (variationMode === 4) {
      // Poisson-disc Sampling: scattered seed points
      const w = parseInt(width) || 800;
      const h = parseInt(height) || 800;
      finalSeeds = generatePoissonSeeds(w, h, 12, randomSeed);
    }

    // Build the CLI execution string
    let cmd = `"${binaryPath}" -in "${inputPath}" -out "${outputPath}" -width ${width} -height ${height}`;
    
    if (whitePercent) cmd += ` -white-percent ${whitePercent}`;
    if (finalColorSort) cmd += ' -colorsort 90'; // default colorsort weight when enabled
    if (finalRandom > 0) cmd += ` -random ${finalRandom}`;
    if (reverse) cmd += ' -reverse';
    if (sweep) cmd += ' -sweep';
    if (randomSeed > 0) cmd += ` -random-seed ${randomSeed}`;
    if (compress) cmd += ` -compress ${compress}`;
    if (finalSeeds && finalSeeds.trim()) cmd += ` -seeds "${finalSeeds.replace(/"/g, '\\"')}"`;

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
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image: ' + error.message },
      { status: 500 }
    );
  }
}