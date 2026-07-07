'use client';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { usePixlate } from '@/context/PixlateContext';
import GenerativeCanvas from './GenerativeCanvas';
import DownloadPreviewModal from '@/components/ui/DownloadPreviewModal';

export default function WorkspaceSection() {
  const {
    image, width, height, processedWidth, processedHeight, whitePercent, colorSort, reverse, randomSeed, variations,
    previewUrl, outputUrl, loading, dragActive, activeTab, setActiveTab,
    textOverlay, textOverlays, setTextOverlays, selectedTextId, setSelectedTextId,
    imageOverlay, imageOverlays, setImageOverlays, selectedOverlayId, setSelectedOverlayId,
    colorOverlay, overlayColor, overlayOpacity, overlayBlend,
    vignette, vignetteStrength, scanLines, scanLineStrength,
    chromatic, chromaticStrength,
    glitch, glitchStrength, blur, blurStrength,
    halftone, halftoneSize,
    coverage, edgeEmphasis, density, brightness, contrast,
    handleDrag, handleDrop, triggerFileInput, handleInspireMe,
    handleProcess, generateFinalCanvas, setRandomSeed
  } = usePixlate();

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState(null);
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false);
  const [activeGuides, setActiveGuides] = useState([]);

  const calculateSnapping = (dragRect, otherRects, parentWidth, parentHeight) => {
    const threshold = 8;
    const guides = [];
    let snappedX = dragRect.x;
    let snappedY = dragRect.y;

    const dragCenter = { x: dragRect.x + dragRect.width / 2, y: dragRect.y + dragRect.height / 2 };

    const checkSnap = (current, target, isVertical) => {
      if (Math.abs(current - target) <= threshold) {
        if (isVertical) guides.push({ type: 'vertical', x: target });
        else guides.push({ type: 'horizontal', y: target });
        return target;
      }
      return null;
    };

    let snapX = checkSnap(dragCenter.x, parentWidth / 2, true);
    if (snapX !== null) snappedX = snapX - dragRect.width / 2;
    let snapY = checkSnap(dragCenter.y, parentHeight / 2, false);
    if (snapY !== null) snappedY = snapY - dragRect.height / 2;

    otherRects.forEach(other => {
      const otherCenter = { x: other.x + other.width / 2, y: other.y + other.height / 2 };
      let sx = checkSnap(dragCenter.x, otherCenter.x, true);
      if (sx !== null) snappedX = sx - dragRect.width / 2;
      let sy = checkSnap(dragCenter.y, otherCenter.y, false);
      if (sy !== null) snappedY = sy - dragRect.height / 2;

      sx = checkSnap(dragRect.x, other.x, true);
      if (sx !== null) snappedX = sx;
      sy = checkSnap(dragRect.y, other.y, false);
      if (sy !== null) snappedY = sy;
      
      sx = checkSnap(dragRect.x + dragRect.width, other.x + other.width, true);
      if (sx !== null) snappedX = sx - dragRect.width;
      sy = checkSnap(dragRect.y + dragRect.height, other.y + other.height, false);
      if (sy !== null) snappedY = sy - dragRect.height;
    });

    return { snappedX, snappedY, guides };
  };

  const handleDragSnap = (d, id, isText) => {
    const parent = document.getElementById('canvas-preview-container');
    if (!parent) return { x: d.x, y: d.y };
    const pw = parent.clientWidth;
    const ph = parent.clientHeight;
    const dragRect = { x: d.x, y: d.y, width: d.node.offsetWidth, height: d.node.offsetHeight };
    const otherElements = [];
    
    textOverlays.forEach(t => {
      if (isText && t.id === id) return;
      const el = document.getElementById(`overlay-text-${t.id}`);
      if (el) {
        const px = (t.x / Math.max(processedWidth || 1, 1)) * pw;
        const py = (t.y / Math.max(processedHeight || 1, 1)) * ph;
        otherElements.push({ x: px, y: py, width: el.offsetWidth, height: el.offsetHeight });
      }
    });

    imageOverlays.forEach(o => {
      if (!isText && o.id === id) return;
      const px = (o.x / Math.max(processedWidth || 1, 1)) * pw;
      const py = (o.y / Math.max(processedHeight || 1, 1)) * ph;
      otherElements.push({ x: px, y: py, width: (o.width / Math.max(processedWidth || 1, 1)) * pw, height: (o.height / Math.max(processedHeight || 1, 1)) * ph });
    });

    const { snappedX, snappedY, guides } = calculateSnapping(dragRect, otherElements, pw, ph);
    setActiveGuides(guides);
    return { x: snappedX, y: snappedY };
  };

  return (
    <div className="workspace">
      {!previewUrl ? (
        <div className="workspace-empty">
          <div
            className={`dropzone-container ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', border: 'none', background: 'transparent', height: '100%' }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '16px' }}>Drop an image or video here</span>
              <span style={{ color: '#71717a', fontSize: '13px' }}>or click to browse / paste from clipboard</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleInspireMe(); }}
              style={{ 
                marginTop: '16px', 
                background: '#27272a', 
                color: '#e4e4e7', 
                border: '1px solid #3f3f46', 
                borderRadius: '8px', 
                padding: '8px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#3f3f46'}
              onMouseOut={(e) => e.currentTarget.style.background = '#27272a'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v1"></path>
                <path d="M12 21v1"></path>
                <path d="M4 12H3"></path>
                <path d="M21 12h-1"></path>
                <path d="M19.07 4.93l-.71.71"></path>
                <path d="M5.64 18.36l-.71.71"></path>
                <path d="M4.93 4.93l.71.71"></path>
                <path d="M18.36 18.36l.71.71"></path>
                <path d="M9 16a5 5 0 1 1 6 0 3.5 3.5 0 0 0-1 3 2 2 0 0 1-4 0 3.5 3.5 0 0 0-1-3z"></path>
                <path d="M9.7 20h4.6"></path>
              </svg>
              Inspire Me
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Workspace Navigation Bar */}
          <div className="workspace-header">
            <div className="workspace-tabs">
              <button
                className={`tab-btn ${activeTab === 'Original' ? 'active' : ''}`}
                onClick={() => setActiveTab('Original')}
              >
                Original
              </button>
              <button
                className={`tab-btn ${activeTab === 'Processed' ? 'active' : ''}`}
                onClick={() => setActiveTab('Processed')}
              >
                Processed
              </button>
            </div>

            {outputUrl && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    const newSeed = Math.floor(Math.random() * 9999) + 1;
                    setRandomSeed(newSeed);
                    handleProcess(image, width, height, whitePercent, colorSort, reverse, newSeed, variations);
                  }}
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: 'auto', padding: '6px 16px', fontSize: '12px', height: '32px' }}
                >
                  Generate Variation
                </button>
                <button
                  onClick={async () => {
                    setIsGeneratingDownload(true);
                    const canvas = await generateFinalCanvas();
                    setPreviewCanvas(canvas);
                    setIsPreviewModalOpen(true);
                    setIsGeneratingDownload(false);
                  }}
                  className="btn-secondary"
                  disabled={isGeneratingDownload || loading}
                  title="Download Image"
                  style={{ width: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}
                >
                  {isGeneratingDownload ? (
                    <div className="spinner" style={{width: '14px', height: '14px', borderTopColor: '#a1a1aa', borderRightColor: '#a1a1aa'}}></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Workspace Image Preview Renderers */}
          <div className="workspace-content">
            {activeTab === 'Original' && (
              <div className="preview-wrapper">
                <img 
                  src={previewUrl} 
                  alt="Original Input" 
                  className="preview-image" 
                  style={{ 
                    filter: `
                      ${chromatic ? `url(#chromatic-${chromaticStrength}) ` : ''}
                      ${glitch ? `url(#glitch-${glitchStrength}) ` : ''}
                      ${blur ? `blur(${blurStrength}px) ` : ''}
                      brightness(${100 + brightness}%)
                      contrast(${contrast}%)
                      saturate(${100 + (density - 30)}%)
                      drop-shadow(0 0 ${edgeEmphasis / 5}px rgba(255,255,255,${edgeEmphasis / 200}))
                    `.replace(/\n/g, ' ').trim(),
                    opacity: coverage / 85
                  }}
                />
              </div>
            )}
            {activeTab === 'Processed' && (
              <div className="preview-wrapper">
                {outputUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      <div 
                        id="canvas-preview-container" 
                        className="effect-container" 
                        style={{ 
                          position: 'relative', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                        onMouseDown={(e) => {
                          if (e.target.id === 'canvas-preview-container' || e.target.classList.contains('preview-image') || e.target.classList.contains('effect-overlay')) {
                            setSelectedOverlayId(null);
                            setSelectedTextId(null);
                          }
                        }}
                      >
                        <img 
                          src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${processedWidth || width || 1}" height="${processedHeight || height || 1}"></svg>`}
                          alt=""
                          style={{
                            display: 'block',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            visibility: 'hidden',
                            pointerEvents: 'none'
                          }}
                        />
                        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                          <GenerativeCanvas
                          outputUrl={outputUrl}
                          width={processedWidth || width}
                          height={processedHeight || height}
                          canvasWidth={width || processedWidth}
                          canvasHeight={height || processedHeight}
                          imageStyle={{ 
                            filter: `
                              ${chromatic ? `url(#chromatic-${chromaticStrength}) ` : ''}
                              ${glitch ? `url(#glitch-${glitchStrength}) ` : ''}
                              ${blur ? `blur(${blurStrength}px) ` : ''}
                              brightness(${100 + brightness}%)
                              contrast(${contrast}%)
                              saturate(${100 + (density - 30)}%)
                              drop-shadow(0 0 ${edgeEmphasis / 5}px rgba(255,255,255,${edgeEmphasis / 200}))
                            `.replace(/\n/g, ' ').trim(),
                            opacity: coverage / 85
                          }}
                        />
                        {loading && (
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '20px', 
                            right: '20px', 
                            background: 'rgba(9, 9, 11, 0.8)', 
                            color: 'white', 
                            padding: '8px 16px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            zIndex: 100,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            border: '1px solid #27272a'
                          }}>
                            <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
                            Regenerating...
                          </div>
                        )}
                        <div className={`effect-overlays`} style={{
                          position: 'absolute', inset: 0, pointerEvents: 'none',
                          '--halftone-size': `${halftoneSize}px`,
                          '--scanline-opacity': scanLineStrength / 100,
                          '--vignette-opacity': vignetteStrength / 100
                        }}>
                          {colorOverlay && <div className="effect-overlay effect-color-overlay" style={{ '--overlay-color': overlayColor, '--overlay-opacity': overlayOpacity / 100, '--overlay-blend': overlayBlend }}></div>}
                          {vignette && <div className="effect-overlay effect-vignette"></div>}
                          {scanLines && <div className="effect-overlay effect-scanlines"></div>}
                          {halftone && <div className="effect-overlay effect-halftone"></div>}
                        </div>

                        {activeGuides.map((guide, i) => (
                          <div
                            key={i}
                            style={{
                              position: 'absolute',
                              pointerEvents: 'none',
                              zIndex: 50,
                              backgroundColor: '#d946ef',
                              ...(guide.type === 'vertical' ? {
                                left: guide.x,
                                top: 0,
                                bottom: 0,
                                width: '1px'
                              } : {
                                top: guide.y,
                                left: 0,
                                right: 0,
                                height: '1px'
                              })
                            }}
                          />
                        ))}

                    {textOverlay && textOverlays.map(textObj => (
                      <Rnd
                        id={`overlay-text-${textObj.id}`}
                        key={textObj.id}
                        style={{
                          border: selectedTextId === textObj.id ? '2px dashed #a855f7' : 'none',
                          zIndex: textObj.front ? (selectedTextId === textObj.id ? 31 : 30) : (selectedTextId === textObj.id ? 11 : 10),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: `"${textObj.font}", sans-serif`,
                          fontSize: `${(typeof textObj.size === 'number' ? textObj.size : 70) * ((document.getElementById('canvas-preview-container')?.clientWidth || 800) / Math.max(processedWidth || 1, 1))}px`,
                          color: textObj.color,
                          fontWeight: textObj.bold ? 'bold' : 'normal',
                          fontStyle: textObj.italic ? 'italic' : 'normal',
                          textDecoration: textObj.underline ? 'underline' : 'none',
                          whiteSpace: 'nowrap',
                          width: 'auto',
                          height: 'auto'
                        }}
                        position={{
                          x: (textObj.x / Math.max(processedWidth || 1, 1)) * (document.getElementById('canvas-preview-container')?.clientWidth || 800),
                          y: (textObj.y / Math.max(processedHeight || 1, 1)) * (document.getElementById('canvas-preview-container')?.clientHeight || 800)
                        }}
                        enableResizing={selectedTextId === textObj.id ? undefined : false}
                        resizeHandleStyles={selectedTextId === textObj.id ? {
                          top: { width: '20px', height: '8px', background: 'white', borderRadius: '4px', left: '50%', marginLeft: '-10px', top: '-5px', border: '1px solid #a855f7' },
                          right: { width: '8px', height: '20px', background: 'white', borderRadius: '4px', top: '50%', marginTop: '-10px', right: '-5px', border: '1px solid #a855f7' },
                          bottom: { width: '20px', height: '8px', background: 'white', borderRadius: '4px', left: '50%', marginLeft: '-10px', bottom: '-5px', border: '1px solid #a855f7' },
                          left: { width: '8px', height: '20px', background: 'white', borderRadius: '4px', top: '50%', marginTop: '-10px', left: '-5px', border: '1px solid #a855f7' },
                          topLeft: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', left: '-6px', top: '-6px', border: '1px solid #a855f7' },
                          topRight: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', right: '-6px', top: '-6px', border: '1px solid #a855f7' },
                          bottomLeft: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', left: '-6px', bottom: '-6px', border: '1px solid #a855f7' },
                          bottomRight: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', right: '-6px', bottom: '-6px', border: '1px solid #a855f7' },
                        } : {}}
                        onDragStart={() => setSelectedTextId(textObj.id)}
                        onDrag={(e, d) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            const snapped = handleDragSnap(d, textObj.id, true);
                            setTextOverlays(prev => prev.map(t => t.id === textObj.id ? {
                              ...t,
                              x: (snapped.x / parent.clientWidth) * (processedWidth || 800),
                              y: (snapped.y / parent.clientHeight) * (processedHeight || 800)
                            } : t));
                          }
                        }}
                        onDragStop={() => setActiveGuides([])}
                        onResize={(e, direction, ref, delta, position) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            const screenFontSize = ref.offsetHeight / 1.2;
                            const newSizeInPx = screenFontSize * (Math.max(processedWidth || 1, 1) / parent.clientWidth);
                            
                            setTextOverlays(prev => prev.map(t => t.id === textObj.id ? {
                              ...t,
                              x: (position.x / parent.clientWidth) * (processedWidth || 800),
                              y: (position.y / parent.clientHeight) * (processedHeight || 800),
                              size: Math.max(10, newSizeInPx)
                            } : t));
                            
                            ref.style.width = 'auto';
                            ref.style.height = 'auto';
                          }
                        }}
                        onMouseDown={(e) => {
                          setSelectedTextId(textObj.id);
                        }}
                      >
                        {selectedTextId === textObj.id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setTextOverlays(prev => prev.filter(t => t.id !== textObj.id));
                              setSelectedTextId(null);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-34px',
                              right: '0',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              zIndex: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Remove text"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        )}
                        {textObj.value}
                      </Rnd>
                    ))}

                    {imageOverlay && imageOverlays.map(overlay => (
                      <Rnd
                        key={overlay.id}
                        style={{ 
                          border: selectedOverlayId === overlay.id ? '2px solid #a855f7' : 'none', 
                          zIndex: selectedOverlayId === overlay.id ? 21 : 20 
                        }}
                        position={{
                          x: (overlay.x / Math.max(processedWidth || 1, 1)) * (document.getElementById('canvas-preview-container')?.clientWidth || 800),
                          y: (overlay.y / Math.max(processedHeight || 1, 1)) * (document.getElementById('canvas-preview-container')?.clientHeight || 800)
                        }}
                        size={{
                          width: (overlay.width / Math.max(processedWidth || 1, 1)) * (document.getElementById('canvas-preview-container')?.clientWidth || 800),
                          height: (overlay.height / Math.max(processedHeight || 1, 1)) * (document.getElementById('canvas-preview-container')?.clientHeight || 800)
                        }}
                        onDragStart={() => setSelectedOverlayId(overlay.id)}
                        onDrag={(e, d) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            const snapped = handleDragSnap(d, overlay.id, false);
                            setImageOverlays(prev => prev.map(o => o.id === overlay.id ? {
                              ...o,
                              x: (snapped.x / parent.clientWidth) * (processedWidth || 800),
                              y: (snapped.y / parent.clientHeight) * (processedHeight || 800)
                            } : o));
                          }
                        }}
                        onDragStop={() => setActiveGuides([])}
                        onResize={(e, direction, ref, delta, position) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            setImageOverlays(prev => prev.map(o => o.id === overlay.id ? {
                              ...o,
                              width: (ref.offsetWidth / parent.clientWidth) * (processedWidth || 800),
                              height: (ref.offsetHeight / parent.clientHeight) * (processedHeight || 800),
                              x: (position.x / parent.clientWidth) * (processedWidth || 800),
                              y: (position.y / parent.clientHeight) * (processedHeight || 800)
                            } : o));
                          }
                        }}
                        bounds="parent"
                        enableResizing={selectedOverlayId === overlay.id ? undefined : false}
                        onMouseDown={(e) => {
                          setSelectedOverlayId(overlay.id);
                        }}
                        resizeHandleStyles={selectedOverlayId === overlay.id ? {
                          top: { width: '20px', height: '8px', background: 'white', borderRadius: '4px', left: '50%', marginLeft: '-10px', top: '-5px', border: '1px solid #a855f7' },
                          right: { width: '8px', height: '20px', background: 'white', borderRadius: '4px', top: '50%', marginTop: '-10px', right: '-5px', border: '1px solid #a855f7' },
                          bottom: { width: '20px', height: '8px', background: 'white', borderRadius: '4px', left: '50%', marginLeft: '-10px', bottom: '-5px', border: '1px solid #a855f7' },
                          left: { width: '8px', height: '20px', background: 'white', borderRadius: '4px', top: '50%', marginTop: '-10px', left: '-5px', border: '1px solid #a855f7' },
                          topLeft: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', left: '-6px', top: '-6px', border: '1px solid #a855f7' },
                          topRight: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', right: '-6px', top: '-6px', border: '1px solid #a855f7' },
                          bottomLeft: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', left: '-6px', bottom: '-6px', border: '1px solid #a855f7' },
                          bottomRight: { width: '12px', height: '12px', background: 'white', borderRadius: '50%', right: '-6px', bottom: '-6px', border: '1px solid #a855f7' },
                        } : {}}
                      >
                        {selectedOverlayId === overlay.id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setImageOverlays(prev => prev.filter(o => o.id !== overlay.id));
                              setSelectedOverlayId(null);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-34px',
                              right: '0',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              zIndex: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Remove overlay"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        )}
                        <img 
                          src={overlay.url} 
                          alt="Overlay" 
                          draggable="false"
                          style={{
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none'
                          }} 
                        />
                      </Rnd>
                    ))}
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="spinner"></div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Processing your image...</span>
              </div>
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Waiting to run process...</span>
            )}
              </div>
            )}
          </div>
          <DownloadPreviewModal 
            isOpen={isPreviewModalOpen} 
            onClose={() => setIsPreviewModalOpen(false)} 
            canvas={previewCanvas} 
          />
        </>
      )}
    </div>
  );
}
