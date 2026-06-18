'use client';
import React, { useState, useRef, useEffect } from 'react';
import { lab } from 'd3-color';
import { usePixlate } from '@/context/PixlateContext';

class Particles {
  constructor(width, height, radius, canvas) {
    this.radius = radius;
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
  }
  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.points = [];
  }
  add(x, y, color = '#000') {
    this.points.push({
      x, y, radius: this.radius, color,
      a: 0.65, age: 0, lifespan: 45,
      vx: 2 * Math.random() - 1, vy: Math.random() - 1
    });
  }
  updateAndDraw(dt) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    while (this.points.length > 0 && this.points[0].age >= this.points[0].lifespan) {
      this.points.shift();
    }
    for (let p of this.points) {
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
    this.ctx.globalAlpha = 1.0;
  }
}

class Mask {
  constructor(width, height, canvas) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.data = null;
  }
  arm(bgcolor = '#18181b') {
    this.ctx.fillStyle = bgcolor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
  uncoverPixel(x, y) {
    let alphaOffset = 4 * (x + this.canvas.width * y) + 3;
    if (this.data && this.data.data) {
      this.data.data[alphaOffset] = 0;
    }
  }
  draw() {
    if (this.data) {
      this.ctx.putImageData(this.data, 0, 0);
    }
  }
}

export default function GenerativeCanvas({ outputUrl, width, height, imageStyle }) {
  const { fetchSequenceData } = usePixlate();
  const [status, setStatus] = useState('initial'); // initial, loading, playing, played
  const maskRef = useRef(null);
  const particlesRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Automatically start animation when the image changes
  useEffect(() => {
    setStatus('initial');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (maskRef.current && width && height) {
      const mask = new Mask(width, height, maskRef.current);
      mask.arm('rgba(24, 24, 27, 0)'); // Transparent initially
      mask.draw();
    }
    
    if (outputUrl && width && height) {
      startAnimation();
    }
  }, [outputUrl, width, height]);

  const generateGrowthSequence = (artWidth, artHeight) => {
    const numPixels = artWidth * artHeight;
    const positions = new Int32Array(numPixels);
    const visited = new Uint8Array(numPixels);
    const queueX = new Int32Array(numPixels);
    const queueY = new Int32Array(numPixels);
    
    let head = 0;
    let tail = 0;

    const numSeeds = 12;
    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(Math.random() * artWidth);
      const y = Math.floor(Math.random() * artHeight);
      const idx = y * artWidth + x;
      if (visited[idx] === 0) {
        queueX[tail] = x;
        queueY[tail] = y;
        visited[idx] = 1;
        tail++;
      }
    }

    const dx = [1, -1, 0, 0];
    const dy = [0, 0, 1, -1];

    let index = 0;
    while (head < tail) {
      const px = queueX[head];
      const py = queueY[head];
      head++;
      
      positions[index++] = py * artWidth + px;

      // Randomize direction order slightly
      const startDir = Math.floor(Math.random() * 4);
      for (let i = 0; i < 4; i++) {
        const d = (startDir + i) % 4;
        const nx = px + dx[d];
        const ny = py + dy[d];
        if (nx >= 0 && nx < artWidth && ny >= 0 && ny < artHeight) {
          const idx = ny * artWidth + nx;
          if (visited[idx] === 0) {
            visited[idx] = 1;
            queueX[tail] = nx;
            queueY[tail] = ny;
            tail++;
          }
        }
      }
    }
    return positions;
  };

  const getSourceImageColors = (srcUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        resolve((x, y) => {
          let offset = 4 * (x + img.width * y);
          return `rgb(${data[offset]},${data[offset+1]},${data[offset+2]})`;
        });
      };
      img.onerror = () => reject(new Error("Failed to load source image for colors"));
      img.src = srcUrl;
    });
  };

  const startAnimation = async () => {
    if (status === 'playing' || status === 'loading') return;

    setStatus('loading');
    
    // Arm the mask (make it solid)
    const mask = new Mask(width, height, maskRef.current);
    mask.arm('#18181b'); // Dark mode color
    mask.draw();
    
    const particles = new Particles(width, height, 1.5, particlesRef.current);
    particles.reset();

    try {
      const colorAtPosition = await getSourceImageColors(outputUrl);
      const positions = generateGrowthSequence(width, height);
      
      const positionAtIndex = (index) => {
        if (index < positions.length) {
          const d = positions[index];
          return [d % width, Math.floor(d / width)];
        }
        return null;
      };

      setStatus('playing');

      let index = 0;
      let prevTimestamp = null;
      // Responsive speed based on image size to finish in a reasonable time
      const speed = Math.max(1000, Math.floor((width * height) / 300)); 

      const frame = (timestamp) => {
        if (!prevTimestamp) prevTimestamp = timestamp;
        const dt = timestamp - prevTimestamp;
        prevTimestamp = timestamp;
        const pc = dt * (60 / 1000);

        for (let i = 0; i < speed; i++) {
          const pos = positionAtIndex(index++);
          if (!pos) break;
          const [x, y] = pos;
          mask.uncoverPixel(x, y);
          
          if (i === 0) { // Add particle for leading edge
            const colorStr = colorAtPosition(x, y);
            const brighterColor = lab(colorStr).brighter(2) + '';
            for (let k = 0; k < 3; k++) {
              particles.add(x, y, brighterColor);
            }
          }
        }
        
        mask.draw();
        particles.updateAndDraw(pc);

        if (positionAtIndex(index) != null) {
          animationFrameRef.current = requestAnimationFrame(frame);
        } else {
          setStatus('played');
          mask.arm('rgba(24, 24, 27, 0)');
          mask.draw();
        }
      };

      animationFrameRef.current = requestAnimationFrame(frame);

    } catch (err) {
      console.error(err);
      setStatus('initial');
      const resetMask = new Mask(width, height, maskRef.current);
      resetMask.arm('rgba(24, 24, 27, 0)'); // reset mask
      resetMask.draw();
      
      if (particlesRef.current) {
        const ctx = particlesRef.current.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.font = '16px sans-serif';
        ctx.fillText("Animation Error: " + err.toString(), 20, 30);
      }
    }
  };

  return (
    <div 
      className="generative-canvas-container" 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={outputUrl}
        alt="Processed Image"
        className="preview-image"
        style={{ ...imageStyle, position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <canvas 
        ref={maskRef}
        style={{ ...imageStyle, position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
      />
      <canvas 
        ref={particlesRef}
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', mixBlendMode: 'screen' }}
      />
      
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(24, 24, 27, 0.5)' }}>
          <div className="spinner"></div>
          <span style={{ color: 'white', marginLeft: '12px', fontSize: '14px' }}>Preparing Animation...</span>
        </div>
      )}
    </div>
  );
}
