'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function GenerativeCanvas() {
  const [pixels, setPixels] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const startGrowth = useCallback(() => {
    if (isGrowing) return;
    setIsGrowing(true);
    setPixels(0);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);
    
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    
    const frontier = [];
    const filled = new Uint8Array(width * height);
    
    // Seed in center
    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);
    
    const addPixel = (x, y, r, g, b) => {
      const idx = (y * width + x);
      if (filled[idx]) return;
      
      filled[idx] = 1;
      const dataIdx = idx * 4;
      data[dataIdx] = r;
      data[dataIdx + 1] = g;
      data[dataIdx + 2] = b;
      data[dataIdx + 3] = 255;
      
      frontier.push({ x, y, r, g, b });
    };
    
    // Start with a random bright color
    addPixel(cx, cy, Math.floor(Math.random() * 128) + 128, Math.floor(Math.random() * 128) + 128, Math.floor(Math.random() * 128) + 128);
    
    let activeCount = 1;
    
    const growPattern = () => {
      // Process multiple pixels per frame to speed it up
      const pixelsPerFrame = 80;
      let addedThisFrame = 0;
      
      for (let i = 0; i < pixelsPerFrame; i++) {
        if (frontier.length === 0) break;
        
        // Pick a random pixel from the frontier
        const fIdx = Math.floor(Math.random() * frontier.length);
        const p = frontier[fIdx];
        
        // Find empty neighbors
        const neighbors = [
          { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
          { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
        ];
        
        const emptyNeighbors = [];
        for (const n of neighbors) {
          const nx = p.x + n.dx;
          const ny = p.y + n.dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (!filled[ny * width + nx]) {
              emptyNeighbors.push({ x: nx, y: ny });
            }
          }
        }
        
        if (emptyNeighbors.length === 0) {
          // Remove from frontier
          frontier.splice(fIdx, 1);
        } else {
          // Pick one empty neighbor
          const n = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
          
          // Mutate color slightly
          const mutate = () => Math.floor((Math.random() - 0.5) * 15);
          const r = Math.max(0, Math.min(255, p.r + mutate()));
          const g = Math.max(0, Math.min(255, p.g + mutate()));
          const b = Math.max(0, Math.min(255, p.b + mutate()));
          
          addPixel(n.x, n.y, r, g, b);
          addedThisFrame++;
          activeCount++;
        }
      }
      
      if (addedThisFrame > 0 || frontier.length > 0) {
        ctx.putImageData(imgData, 0, 0);
        setPixels(activeCount);
        rafRef.current = requestAnimationFrame(growPattern);
      } else {
        setIsGrowing(false);
      }
    };
    
    rafRef.current = requestAnimationFrame(growPattern);
  }, [isGrowing]);

  useEffect(() => {
    // Initial black fill
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff', fontFamily: 'sans-serif' }}>Crystal Growth Engine</h3>
      <p style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontFamily: 'monospace' }}>Active Pixels: {pixels}</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <canvas 
          ref={canvasRef} 
          width={250} 
          height={250} 
          style={{ width: '100%', maxWidth: '250px', height: 'auto', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', imageRendering: 'pixelated' }} 
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={startGrowth}
          disabled={isGrowing}
          style={{
            padding: '10px 24px',
            backgroundColor: isGrowing ? 'rgba(255,255,255,0.1)' : '#fff',
            color: isGrowing ? 'rgba(255,255,255,0.5)' : '#000',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '24px',
            border: 'none',
            cursor: isGrowing ? 'default' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isGrowing ? 'Growing...' : 'Grow Canvas'}
        </button>
      </div>
    </div>
  );
}
