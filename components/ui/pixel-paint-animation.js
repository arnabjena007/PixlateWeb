'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// --- Pure JS Classes (ported from script.js / CoffeeScript) ---

function getBackingScale(ctx) {
  if ('devicePixelRatio' in window) {
    const devicePixelRatio = window.devicePixelRatio;
    const backingStoreRatio =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    return devicePixelRatio / backingStoreRatio;
  }
  return 1;
}

function retinize(canvas) {
  const ctx = canvas.getContext('2d');
  const backingScale = getBackingScale(ctx);
  const width = canvas.width;
  const height = canvas.height;
  canvas.width = width * backingScale;
  canvas.height = height * backingScale;
}

class Particles {
  constructor(width, height, radius, canvas) {
    this.radius = radius;
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    retinize(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.backingScale = getBackingScale(this.ctx);
    this.ctx.setTransform(this.backingScale, 0, 0, this.backingScale, 0, 0);
    this.points = [];
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.points = [];
  }

  add(x, y, color = '#000') {
    this.points.push({
      x, y,
      radius: this.radius,
      color,
      a: 0.65,
      age: 0,
      lifespan: 45,
      vx: 2 * Math.random() - 1,
      vy: Math.random() - 1,
    });
  }

  updateAndDraw(dt) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    while (this.points.length > 0 && this.points[0].age >= this.points[0].lifespan) {
      this.points.shift();
    }
    for (const p of this.points) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.age++;
      if (p.age < p.lifespan) {
        this.ctx.beginPath();
        this.ctx.globalAlpha = p.a * (1 - p.age / p.lifespan);
        this.ctx.fillStyle = p.color;
        this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }
}

class Mask {
  constructor(width, height, canvas) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.data = null;
  }

  arm(bgcolor = '#F0F0F0') {
    this.ctx.fillStyle = bgcolor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  uncoverPixel(x, y) {
    const alphaOffset = 4 * (x + this.canvas.width * y) + 3;
    this.data.data[alphaOffset] = 0;
  }

  draw() {
    this.ctx.putImageData(this.data, 0, 0);
  }
}

// --- Image loading helpers ---
function loadImage(url, init = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    for (const key in init) img[key] = init[key];
    img.onerror = reject;
    img.onload = () => resolve(img);
    img.src = url;
  });
}

const ART_WIDTH = 1125;
const ART_HEIGHT = 675;
const NUM_PIXELS = ART_WIDTH * ART_HEIGHT;

function decompressPositionSequence(img) {
  const canvas = document.createElement('canvas');
  canvas.width = ART_WIDTH;
  canvas.height = ART_HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data: buf } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const positions = new Int32Array(NUM_PIXELS);
  const base = 256;
  const baseSquared = base * base;
  for (let i = 0; i < NUM_PIXELS; i++) {
    const index = i * 4;
    const order = buf[index] * baseSquared + buf[index + 1] * base + buf[index + 2];
    positions[order] = i;
  }
  return positions;
}

async function loadPlaybackData(name) {
  const [positions, srcImg] = await Promise.all([
    // Load sequence image from /img/new/s/<name>
    loadImage(`/img/new/s/${name}`, { crossOrigin: 'anonymous' })
      .then(decompressPositionSequence),
    // Load source color image from /img/new/<name>
    loadImage(`/img/new/${name}`),
  ]);

  // Build color lookup from srcImg
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = srcImg.width;
  colorCanvas.height = srcImg.height;
  const colorCtx = colorCanvas.getContext('2d');
  colorCtx.drawImage(srcImg, 0, 0, srcImg.width, srcImg.height);
  const imgData = colorCtx.getImageData(0, 0, srcImg.width, srcImg.height).data;

  const ret = [];
  return {
    positionAtIndex(index) {
      if (index < positions.length) {
        const d = positions[index];
        ret[0] = d % ART_WIDTH;
        ret[1] = Math.floor(d / ART_WIDTH);
        return ret;
      }
      return null;
    },
    colorAtPosition(x, y) {
      const offset = 4 * (x + srcImg.width * y);
      return `rgb(${imgData[offset]},${imgData[offset + 1]},${imgData[offset + 2]})`;
    },
  };
}

// Simple LAB brighter approximation (replicate d3.lab().brighter(2))
function brighterColor(rgbStr) {
  const match = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return rgbStr;
  const factor = Math.pow(1.7, 2); // brighter(2)
  const r = Math.min(255, Math.round(parseInt(match[1]) * factor));
  const g = Math.min(255, Math.round(parseInt(match[2]) * factor));
  const b = Math.min(255, Math.round(parseInt(match[3]) * factor));
  return `rgb(${r},${g},${b})`;
}

// --- React Component ---
const GALLERY_IMAGES = [
  { num: 'pixlate-demo-9', label: 'Pixlate Demo 9' },
  { num: 'pixlate-demo-2',  label: 'Pixlate Demo 2' },
  { num: 'pixlate-demo-12', label: 'Pixlate Demo 12' },
  { num: 'pixlate-demo-7', label: 'Pixlate Demo 7' },
  { num: 'pixlate-demo-10', label: 'Pixlate Demo 10' },
  { num: 'pixlate-demo-8', label: 'Pixlate Demo 8' },
  { num: 'pixlate-demo-11', label: 'Pixlate Demo 11' },
  { num: 'pixlate-demo-6', label: 'Pixlate Demo 6' },
  { num: 'pixlate-demo-3', label: 'Pixlate Demo 3' },
  { num: 'pixlate-demo-4', label: 'Pixlate Demo 4' },
  { num: 'pixlate-demo-5', label: 'Pixlate Demo 5' },
  { num: 'pixlate-demo-1',  label: 'Pixlate Demo 1' },
];

export default function PixelPaintAnimation() {
  const maskCanvasRef   = useRef(null); // pixel-cover mask
  const particleCanvasRef = useRef(null); // particles overlay

  const [status, setStatus] = useState('idle'); // idle | loading | playing | played | error
  const [activeImage, setActiveImage] = useState(GALLERY_IMAGES[0]);
  const [caption, setCaption] = useState('Watch it paint');

  const animFrameRef    = useRef(null);
  const particlesRef    = useRef(null);
  const maskRef         = useRef(null);

  // Track time for dt calculation
  const prevTimeRef = useRef(null);
  const trackTime = useCallback((timestamp) => {
    if (prevTimeRef.current == null) prevTimeRef.current = timestamp;
    const dt = timestamp - prevTimeRef.current;
    prevTimeRef.current = timestamp;
    return dt * (60 / 1000);
  }, []);

  // Reset animation state
  const reset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    prevTimeRef.current = null;
    if (particlesRef.current) particlesRef.current.reset();
    // Clear mask canvas so the full artwork image shows through
    if (maskRef.current) {
      maskRef.current.ctx.clearRect(
        0, 0,
        maskRef.current.canvas.width,
        maskRef.current.canvas.height
      );
    }
    setStatus('idle');
    setCaption('Watch it paint');
  }, []);

  // Initialise canvas objects once mounted
  useEffect(() => {
    if (!maskCanvasRef.current || !particleCanvasRef.current) return;
    particlesRef.current = new Particles(ART_WIDTH, ART_HEIGHT, 1, particleCanvasRef.current);
    maskRef.current = new Mask(ART_WIDTH, ART_HEIGHT, maskCanvasRef.current);
  }, []);

  // When active image changes, reset and update the display img
  useEffect(() => {
    reset();
  }, [activeImage, reset]);

  const handlePlay = useCallback(async () => {
    if (status === 'loading' || status === 'playing') return;

    reset();
    setStatus('loading');
    maskRef.current.arm('#0a0a0a'); // dark background to match theme
    particlesRef.current.reset();

    try {
      const playback = await loadPlaybackData(`${activeImage.num}.png`);
      setStatus('playing');
      prevTimeRef.current = null;
      let index = 0;
      const SPEED = 750; // pixels revealed per frame

      const frame = (timestamp) => {
        const pc = trackTime(timestamp);
        for (let i = 0; i < SPEED; i++) {
          const pos = playback.positionAtIndex(index++);
          if (!pos) break;
          const [x, y] = pos;
          maskRef.current.uncoverPixel(x, y);
          if (i === 0) {
            const color = brighterColor(playback.colorAtPosition(x, y));
            for (let k = 0; k < 3; k++) {
              particlesRef.current.add(x, y, color);
            }
          }
        }
        maskRef.current.draw();
        particlesRef.current.updateAndDraw(pc);

        if (playback.positionAtIndex(index) != null) {
          animFrameRef.current = requestAnimationFrame(frame);
        } else {
          setCaption('Watch Again');
          setStatus('played');
        }
      };

      animFrameRef.current = requestAnimationFrame(frame);
    } catch (err) {
      console.error('Animation error:', err);
      setCaption('Loading error — try again?');
      setStatus('error');
    }
  }, [activeImage, status, reset, trackTime]);

  // Clean up on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const isLoading = status === 'loading';
  const isPlaying = status === 'playing';
  const canInteract = status !== 'loading' && status !== 'playing';

  return (
    <div className="ppa-root">
      {/* Main animation canvas area */}
      <div
        className={`ppa-stage ${status}`}
        onClick={canInteract ? handlePlay : undefined}
        style={{ cursor: canInteract ? 'pointer' : 'default' }}
        title={canInteract ? 'Click to paint' : ''}
      >
        {/* Artwork base image */}
        <img
          className="ppa-art"
          src={`/img/new/${activeImage.num}.png`}
          alt={activeImage.label}
          crossOrigin="anonymous"
        />

        {/* Mask canvas (covers image, reveals pixel by pixel) */}
        <canvas ref={maskCanvasRef} className="ppa-canvas ppa-mask" />

        {/* Particle canvas (sparkles during paint) */}
        <canvas ref={particleCanvasRef} className="ppa-canvas ppa-particles" />

        {/* Play overlay */}
        <div className={`ppa-overlay ${(isLoading || isPlaying) ? 'hidden' : ''}`}>
          <div className="ppa-play-btn">
            {isLoading ? (
              <div className="ppa-spinner" />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
            <span className="ppa-caption">{caption}</span>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="ppa-loading-overlay">
            <div className="ppa-spinner" />
          </div>
        )}
      </div>

      {/* Thumbnail gallery strip */}
      <div className="ppa-thumbnails">
        {GALLERY_IMAGES.map((img) => (
          <button
            key={img.num}
            className={`ppa-thumb ${activeImage.num === img.num ? 'active' : ''}`}
            onClick={() => setActiveImage(img)}
            title={img.label}
            type="button"
          >
            <img src={`/img/${img.num}.jpg`} alt={img.label} />
          </button>
        ))}
      </div>
    </div>
  );
}
