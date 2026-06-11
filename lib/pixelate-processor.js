/**
 * Pure JavaScript pixelation processor
 * Replaces the Go binary with serverless-compatible logic
 * Uses Sharp for fast, serverless-optimized image processing
 */

import sharp from 'sharp';

/**
 * Get luminance of a pixel (for sorting)
 */
function getLuminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Sort pixels by luminance
 */
function sortPixelsByLuminance(pixels, reverse = false) {
  const sorted = [...pixels].sort((a, b) => {
    const lumA = getLuminance(a.r, a.g, a.b);
    const lumB = getLuminance(b.r, b.g, b.b);
    return reverse ? lumB - lumA : lumA - lumB;
  });
  return sorted;
}

/**
 * Apply white percent filter (remove bright pixels)
 */
function applyWhitePercent(pixels, whitePercent) {
  if (whitePercent <= 0) return pixels;

  const threshold = (whitePercent / 100) * 255;
  return pixels.filter((pixel) => {
    const lum = getLuminance(pixel.r, pixel.g, pixel.b);
    return lum < threshold;
  });
}

/**
 * Apply color sort (group similar colors)
 */
function applyColorSort(pixels, weight = 90) {
  // Sort by hue/saturation first, then by luminance
  const sorted = [...pixels].sort((a, b) => {
    const [hA, sA, vA] = rgbToHsv(a.r, a.g, a.b);
    const [hB, sB, vB] = rgbToHsv(b.r, b.g, b.b);

    // Primary sort by hue
    if (Math.abs(hA - hB) > 10) return hA - hB;
    // Secondary sort by saturation
    if (Math.abs(sA - sB) > 10) return sB - sA;
    // Tertiary sort by value (brightness)
    return vA - vB;
  });

  return sorted;
}

/**
 * Convert RGB to HSV
 */
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  const s = max === 0 ? 0 : d / max;
  const v = max;

  return [h * 360, s * 100, v * 100];
}

/**
 * Apply random shuffling with seeded randomness
 */
function applyRandom(pixels, weight = 50, seed = 0) {
  if (weight <= 0) return pixels;

  const result = [...pixels];
  const random = seededRandom(seed);

  // Fisher-Yates shuffle with weighted probability
  for (let i = result.length - 1; i > 0; i--) {
    if (random() * 100 < weight) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
  }

  return result;
}

/**
 * Seeded random number generator
 */
function seededRandom(seed) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Apply sweep (gradient-based ordering)
 */
function applySweep(pixels, width, height) {
  // Map pixels to grid positions and sort by sweep line
  const pixelMap = new Map();

  pixels.forEach((pixel, index) => {
    const y = Math.floor(index / width);
    const x = index % width;
    pixelMap.set(index, { pixel, x, y });
  });

  const sorted = Array.from(pixelMap.entries())
    .sort(([, a], [, b]) => {
      // Sweep from top-left to bottom-right
      return a.y * width + a.x - (b.y * width + b.x);
    })
    .map(([, { pixel }]) => pixel);

  return sorted;
}

/**
 * Main pixelation processor
 */
export async function processPixelate(buffer, options = {}) {
  const {
    width = 800,
    height = 800,
    whitePercent = 0,
    colorSort = false,
    random = 0,
    reverse = false,
    sweep = false,
    randomSeed = 0,
    compress = 0,
  } = options;

  try {
    // Load and resize image using Sharp (serverless-optimized)
    let pipeline = sharp(buffer);
    
    // Get image metadata
    const metadata = await pipeline.metadata();
    
    // Resize if needed
    if (metadata.width !== width || metadata.height !== height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'fill',
        withoutEnlargement: false,
      });
    }

    // Extract raw pixel data
    const { data, info } = await pipeline
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Convert buffer to pixel array
    const pixels = [];
    for (let i = 0; i < data.length; i += info.channels) {
      pixels.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: info.channels === 4 ? data[i + 3] : 255,
      });
    }

    // Apply filters in order
    let sortedPixels = [...pixels];

    if (whitePercent > 0) {
      sortedPixels = applyWhitePercent(sortedPixels, whitePercent);
    }

    if (colorSort) {
      sortedPixels = applyColorSort(sortedPixels, 90);
    } else if (sweep) {
      sortedPixels = applySweep(sortedPixels, width, height);
    } else {
      sortedPixels = sortPixelsByLuminance(sortedPixels, reverse);
    }

    if (random > 0) {
      sortedPixels = applyRandom(sortedPixels, random, randomSeed);
    }

    // Reconstruct image from sorted pixels
    const outputData = Buffer.alloc(data.length);
    sortedPixels.forEach((pixel, idx) => {
      const pos = idx * info.channels;
      outputData[pos] = pixel.r;
      outputData[pos + 1] = pixel.g;
      outputData[pos + 2] = pixel.b;
      if (info.channels === 4) {
        outputData[pos + 3] = pixel.a;
      }
    });

    // Create output image from raw pixel data
    let outputPipeline = sharp(outputData, {
      raw: {
        width,
        height,
        channels: info.channels,
      },
    });

    // Apply compression if specified
    if (compress > 0) {
      const quality = Math.max(50, 100 - compress);
      outputPipeline = outputPipeline.png({ quality });
    }

    // Convert to PNG buffer
    const pngBuffer = await outputPipeline.png().toBuffer();

    return pngBuffer;
  } catch (error) {
    console.error('Pixelation error:', error);
    throw new Error(`Pixelation processing failed: ${error.message}`);
  }
}

export default processPixelate;