'use client';
import { useEffect, useRef, useState } from 'react';

// ── Particle engine ──────────────────────────────────────────────────────────
class Particles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.points = [];
  }

  resize(w, h) {
    this.canvas.width  = w;
    this.canvas.height = h;
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.points = [];
  }

  add(x, y, color) {
    this.points.push({
      x, y, color,
      radius: 1.5,
      a: 0.7,
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
        this.ctx.fillStyle   = p.color;
        this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }
}

// ── Mask engine ──────────────────────────────────────────────────────────────
class Mask {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.data   = null;
    this.w = 0;
    this.h = 0;
  }

  arm(w, h) {
    this.w = w;
    this.h = h;
    this.canvas.width  = w;
    this.canvas.height = h;
    this.ctx.fillStyle = '#09090b';
    this.ctx.fillRect(0, 0, w, h);
    this.data = this.ctx.getImageData(0, 0, w, h);
  }

  uncoverPixel(cx, cy) {
    const off = 4 * (cx + this.w * cy) + 3;
    if (off + 3 < this.data.data.length) this.data.data[off] = 0;
  }

  draw() { this.ctx.putImageData(this.data, 0, 0); }

  clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a pixel-reveal order (sorted by luminance ascending = dark→light)
 * operating entirely in DISPLAY-space (CW × CH).
 *
 * For each display pixel we find the corresponding image pixel via the
 * object-fit:cover inverse transform, read its luminance, then sort.
 *
 * Returns: { order: Int32Array of display-pixel indices, colors: Uint8Array [r,g,b per pixel] }
 */
function buildDisplayOrder(raw, IW, IH, CW, CH) {
  const scale = Math.max(CW / IW, CH / IH);
  const ox    = (CW - IW * scale) / 2;
  const oy    = (CH - IH * scale) / 2;

  const N    = CW * CH;
  const lum  = new Float32Array(N);
  const colR = new Uint8Array(N);
  const colG = new Uint8Array(N);
  const colB = new Uint8Array(N);
  const order = new Int32Array(N);

  for (let cy = 0; cy < CH; cy++) {
    for (let cx = 0; cx < CW; cx++) {
      const idx = cy * CW + cx;
      order[idx] = idx;

      // Map display pixel → image pixel
      const ix = Math.round((cx - ox) / scale);
      const iy = Math.round((cy - oy) / scale);
      const ixi = Math.max(0, Math.min(IW - 1, ix));
      const iyi = Math.max(0, Math.min(IH - 1, iy));

      const b = (iyi * IW + ixi) * 4;
      const r = raw[b], g = raw[b + 1], bl = raw[b + 2];
      lum[idx]  = 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      colR[idx] = r;
      colG[idx] = g;
      colB[idx] = bl;
    }
  }

  // Sort by luminance (dark → light)
  order.sort((a, b) => lum[a] - lum[b]);

  return { order, colR, colG, colB };
}

function brighterRgb(r, g, b, f = 2.8) {
  return `rgb(${Math.min(255, (r * f) | 0)},${Math.min(255, (g * f) | 0)},${Math.min(255, (b * f) | 0)})`;
}

// ── Component ────────────────────────────────────────────────────────────────
const SPEED = 8000; // display-pixels revealed per animation frame

export default function WorkspacePaintReveal({ imageUrl }) {
  const wrapRef = useRef(null);
  const maskEl  = useRef(null);
  const partEl  = useRef(null);

  const maskObj = useRef(null);
  const partObj = useRef(null);
  const rafRef  = useRef(null);
  const prevT   = useRef(null);

  const [imgSrc, setImgSrc] = useState(null);
  const [done,   setDone]   = useState(false);

  // Init objects once
  useEffect(() => {
    if (maskEl.current && partEl.current) {
      maskObj.current = new Mask(maskEl.current);
      partObj.current = new Particles(partEl.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Kick off animation whenever imageUrl changes
  useEffect(() => {
    if (!imageUrl) { setImgSrc(null); setDone(false); return; }

    cancelAnimationFrame(rafRef.current);
    setDone(false);
    setImgSrc(null);
    if (maskObj.current) maskObj.current.clear();
    if (partObj.current) partObj.current.reset();

    const img = new Image();

    img.onload = () => {
      setImgSrc(imageUrl); // show base img

      const IW = img.naturalWidth;
      const IH = img.naturalHeight;

      // Read container display size
      const CW = wrapRef.current?.clientWidth  || 800;
      const CH = wrapRef.current?.clientHeight || 600;

      // Read image pixels
      const offscreen = document.createElement('canvas');
      offscreen.width  = IW;
      offscreen.height = IH;
      offscreen.getContext('2d').drawImage(img, 0, 0);
      const { data: raw } = offscreen.getContext('2d').getImageData(0, 0, IW, IH);

      // Build display-space order
      const { order, colR, colG, colB } = buildDisplayOrder(raw, IW, IH, CW, CH);

      // Arm mask & particles at display size
      maskObj.current.arm(CW, CH);
      partObj.current.resize(CW, CH);
      partObj.current.reset();
      prevT.current = null;

      let index = 0;

      const frame = (ts) => {
        if (prevT.current == null) prevT.current = ts;
        const dt = (ts - prevT.current) * (60 / 1000);
        prevT.current = ts;

        for (let i = 0; i < SPEED; i++) {
          if (index >= order.length) break;
          const idx = order[index++];
          const cx  = idx % CW;
          const cy  = (idx / CW) | 0;
          maskObj.current.uncoverPixel(cx, cy);

          if (i % 300 === 0) {
            const color = brighterRgb(colR[idx], colG[idx], colB[idx]);
            for (let k = 0; k < 2; k++) partObj.current.add(cx, cy, color);
          }
        }

        maskObj.current.draw();
        partObj.current.updateAndDraw(dt);

        if (index < order.length) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          setDone(true);
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    };

    img.onerror = () => { setImgSrc(imageUrl); setDone(true); };
    img.src = imageUrl;

    return () => cancelAnimationFrame(rafRef.current);
  }, [imageUrl]);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* Base image fills container — object-fit:cover */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Processed output"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '4px',
            display: 'block',
          }}
        />
      )}

      {/* Mask canvas — same display size, covers image until pixels uncovered */}
      <canvas
        ref={maskEl}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: done ? 'none' : 'block',
        }}
      />

      {/* Particle sparkle canvas */}
      <canvas
        ref={partEl}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          display: done ? 'none' : 'block',
        }}
      />
    </div>
  );
}
