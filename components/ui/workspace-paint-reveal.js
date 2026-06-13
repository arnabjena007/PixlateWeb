'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

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

function buildDisplayOrder(raw, IW, IH, CW, CH) {
  const scale = Math.min(CW / IW, CH / IH);
  const ox    = (CW - IW * scale) / 2;
  const oy    = (CH - IH * scale) / 2;

  const N    = CW * CH;
  const colR = new Uint8Array(N);
  const colG = new Uint8Array(N);
  const colB = new Uint8Array(N);

  for (let cy = 0; cy < CH; cy++) {
    for (let cx = 0; cx < CW; cx++) {
      const idx = cy * CW + cx;

      // Map display pixel → image pixel
      const ix = Math.round((cx - ox) / scale);
      const iy = Math.round((cy - oy) / scale);
      const ixi = Math.max(0, Math.min(IW - 1, ix));
      const iyi = Math.max(0, Math.min(IH - 1, iy));

      const b = (iyi * IW + ixi) * 4;
      colR[idx] = raw[b];
      colG[idx] = raw[b + 1];
      colB[idx] = raw[b + 2];
    }
  }

  // Build order using crystal growth pattern
  const order = new Int32Array(N);
  const filled = new Uint8Array(N);
  const frontier = [];
  
  const cx = Math.floor(CW / 2);
  const cy = Math.floor(CH / 2);
  
  let orderIdx = 0;
  
  const addPixel = (x, y) => {
    const idx = y * CW + x;
    if (filled[idx]) return;
    filled[idx] = 1;
    order[orderIdx++] = idx;
    frontier.push({ x, y });
  };
  
  addPixel(cx, cy);
  
  while (frontier.length > 0) {
    const fIdx = Math.floor(Math.random() * frontier.length);
    const p = frontier[fIdx];
    
    let nx, ny;
    const emptyNeighbors = [];
    
    nx = p.x - 1; ny = p.y;
    if (nx >= 0 && !filled[ny * CW + nx]) emptyNeighbors.push(nx, ny);
    
    nx = p.x + 1; ny = p.y;
    if (nx < CW && !filled[ny * CW + nx]) emptyNeighbors.push(nx, ny);
    
    nx = p.x; ny = p.y - 1;
    if (ny >= 0 && !filled[ny * CW + nx]) emptyNeighbors.push(nx, ny);
    
    nx = p.x; ny = p.y + 1;
    if (ny < CH && !filled[ny * CW + nx]) emptyNeighbors.push(nx, ny);
    
    if (emptyNeighbors.length === 0) {
      const last = frontier.pop();
      if (fIdx < frontier.length) {
        frontier[fIdx] = last;
      }
    } else {
      const nIdx = Math.floor(Math.random() * (emptyNeighbors.length / 2)) * 2;
      addPixel(emptyNeighbors[nIdx], emptyNeighbors[nIdx + 1]);
    }
  }

  return { order, colR, colG, colB };
}

function brighterRgb(r, g, b, f = 2.8) {
  return `rgb(${Math.min(255, (r * f) | 0)},${Math.min(255, (g * f) | 0)},${Math.min(255, (b * f) | 0)})`;
}

// ── Component ────────────────────────────────────────────────────────────────
const SPEED = 8000; // display-pixels revealed per animation frame

export default function WorkspacePaintReveal({ imageUrl, className, imageStyle }) {
  const wrapRef = useRef(null);
  const maskEl  = useRef(null);
  const partEl  = useRef(null);

  const maskObj = useRef(null);
  const partObj = useRef(null);
  const rafRef  = useRef(null);
  const prevT   = useRef(null);

  const [imgSrc, setImgSrc] = useState(null);
  const [done,   setDone]   = useState(false);
  const [status, setStatus] = useState('idle');

  // Init objects once
  useEffect(() => {
    if (maskEl.current && partEl.current) {
      maskObj.current = new Mask(maskEl.current);
      partObj.current = new Particles(partEl.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Show image immediately, reset state
  useEffect(() => {
    if (!imageUrl) { setImgSrc(null); setDone(false); setStatus('idle'); return; }

    cancelAnimationFrame(rafRef.current);
    setDone(false);
    setStatus('idle');
    setImgSrc(imageUrl);
    if (maskObj.current) maskObj.current.clear();
    if (partObj.current) partObj.current.reset();
  }, [imageUrl]);

  const handlePlay = useCallback(() => {
    if (status === 'playing' || !imageUrl) return;

    cancelAnimationFrame(rafRef.current);
    setDone(false);
    setStatus('playing');

    if (maskObj.current) maskObj.current.clear();
    if (partObj.current) partObj.current.reset();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgSrc(imageUrl);

      const IW = img.naturalWidth;
      const IH = img.naturalHeight;

      const CW = wrapRef.current?.clientWidth  || 800;
      const CH = wrapRef.current?.clientHeight || 600;

      const offscreen = document.createElement('canvas');
      offscreen.width  = IW;
      offscreen.height = IH;
      offscreen.getContext('2d').drawImage(img, 0, 0);
      const { data: raw } = offscreen.getContext('2d').getImageData(0, 0, IW, IH);

      const { order, colR, colG, colB } = buildDisplayOrder(raw, IW, IH, CW, CH);

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
          
          // Only uncover pixels that are inside the image bounds
          const ix = Math.round((cx - ox) / scale);
          const iy = Math.round((cy - oy) / scale);
          if (ix >= 0 && ix < IW && iy >= 0 && iy < IH) {
            maskObj.current.uncoverPixel(cx, cy);
          } else {
             // For blank margins in contain, we should perhaps keep them uncovered, but let's just uncover them instantly
             maskObj.current.uncoverPixel(cx, cy);
          }

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
          setStatus('done');
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    };

    img.onerror = () => { setImgSrc(imageUrl); setDone(true); setStatus('done'); };
    img.src = imageUrl;
  }, [imageUrl, status]);

  // Expose play function to external caller if needed, or trigger on click
  return (
    <div
      ref={wrapRef}
      className={className}
      onClick={status !== 'playing' ? handlePlay : undefined}
      style={{ position: 'relative', overflow: 'hidden', cursor: status !== 'playing' ? 'pointer' : 'default' }}
      title={status !== 'playing' ? "Click to paint" : ""}
    >
      {/* Base image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Processed output"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            ...imageStyle
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
