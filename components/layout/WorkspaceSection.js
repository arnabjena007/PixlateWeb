'use client';
import { Rnd } from 'react-rnd';
import { usePixlate } from '@/context/PixlateContext';

export default function WorkspaceSection() {
  const {
    image, width, height, whitePercent, colorSort, reverse, randomSeed, variations,
    previewUrl, outputUrl, loading, dragActive, activeTab, setActiveTab,
    textOverlay, textOverlays, setTextOverlays, selectedTextId, setSelectedTextId,
    imageOverlay, imageOverlays, setImageOverlays, selectedOverlayId, setSelectedOverlayId,
    colorOverlay, overlayColor, overlayOpacity, overlayBlend,
    vignette, vignetteStrength, scanLines, scanLineStrength,
    crt, crtStrength, chromatic, chromaticStrength,
    glitch, glitchStrength, blur, blurStrength,
    halftone, halftoneSize,
    handleDrag, handleDrop, triggerFileInput, handleInspireMe,
    handleProcess, handleDownload, setRandomSeed
  } = usePixlate();

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
          >
            <span className="dropzone-title">Drop an image here</span>
            <span className="dropzone-sub">or click to browse / paste from clipboard</span>

            <button
              type="button"
              className="btn-secondary"
              onClick={(e) => { e.stopPropagation(); handleInspireMe(); }}
              style={{ marginTop: '12px', width: 'auto', padding: '8px 20px' }}
            >
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
                    // note: sweep, random, compress, seeds variables are not defined in main state as controlled variables in previous page.js but passed locally. 
                    // To handle generate variation correctly, we use handleProcess directly.
                    handleProcess(image, width, height, whitePercent, colorSort, reverse, newSeed, variations);
                  }}
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: 'auto', padding: '6px 16px', fontSize: '12px', height: '32px' }}
                >
                  Generate Variation
                </button>
                <button
                  onClick={handleDownload}
                  className="btn-secondary"
                  style={{ width: 'auto', padding: '6px 16px', fontSize: '12px', height: '32px' }}
                >
                  Download Image
                </button>
              </div>
            )}
          </div>

          {/* Workspace Image Preview Renderers */}
          <div className="workspace-content">
            {activeTab === 'Original' && (
              <div className="preview-wrapper">
                <img src={previewUrl} alt="Original Input" className="preview-image" />
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
                          aspectRatio: `${width || 1} / ${height || 1}`,
                          maxWidth: '100%',
                          maxHeight: '100%',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                        onMouseDown={(e) => {
                          if (e.target.id === 'canvas-preview-container' || e.target.classList.contains('preview-image') || e.target.classList.contains('effect-overlay')) {
                            setSelectedOverlayId(null);
                            setSelectedTextId(null);
                          }
                        }}
                      >
                        <img
                          src={outputUrl}
                          alt="Processed Image"
                          className="preview-image"
                          style={{ filter: chromatic ? 'url(#chromatic)' : glitch ? 'url(#glitch)' : blur ? `blur(${blurStrength}px)` : 'none' }}
                        />
                        <div className={`effect-overlays ${crt ? 'effect-crt' : ''}`} style={{
                          position: 'absolute', inset: 0, pointerEvents: 'none',
                          '--crt-opacity': crtStrength / 100,
                          '--halftone-size': `${halftoneSize}px`,
                          '--scanline-opacity': scanLineStrength / 100,
                          '--vignette-opacity': vignetteStrength / 100
                        }}>
                          {colorOverlay && <div className="effect-overlay effect-color-overlay" style={{ '--overlay-color': overlayColor, '--overlay-opacity': overlayOpacity / 100, '--overlay-blend': overlayBlend }}></div>}
                          {vignette && <div className="effect-overlay effect-vignette"></div>}
                          {scanLines && <div className="effect-overlay effect-scanlines"></div>}
                          {halftone && <div className="effect-overlay effect-halftone"></div>}
                        </div>

                    {textOverlay && textOverlays.map(textObj => (
                      <Rnd
                        key={textObj.id}
                        style={{
                          border: selectedTextId === textObj.id ? '2px dashed #a855f7' : 'none',
                          zIndex: selectedTextId === textObj.id ? 16 : textObj.front ? 15 : 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: `"${textObj.font}", sans-serif`,
                          fontSize: `${(textObj.size === 'Small' ? 30 : textObj.size === 'Large' ? 150 : textObj.size === 'Extra Large' ? 300 : 70) * ((document.getElementById('canvas-preview-container')?.clientWidth || 800) / Math.max(width || 1, 1))}px`,
                          color: textObj.color,
                          fontWeight: textObj.bold ? 'bold' : 'normal',
                          fontStyle: textObj.italic ? 'italic' : 'normal',
                          textDecoration: textObj.underline ? 'underline' : 'none',
                          whiteSpace: 'nowrap'
                        }}
                        position={{
                          x: (textObj.x / 100) * (document.getElementById('canvas-preview-container')?.clientWidth || 800),
                          y: (textObj.y / 100) * (document.getElementById('canvas-preview-container')?.clientHeight || 800)
                        }}
                        enableResizing={false}
                        onDragStart={() => setSelectedTextId(textObj.id)}
                        onDrag={(e, d) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            setTextOverlays(prev => prev.map(t => t.id === textObj.id ? {
                              ...t,
                              x: (d.x / parent.clientWidth) * 100,
                              y: (d.y / parent.clientHeight) * 100
                            } : t));
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
                          zIndex: selectedOverlayId === overlay.id ? 12 : 11 
                        }}
                        position={{
                          x: (overlay.x / 100) * (document.getElementById('canvas-preview-container')?.clientWidth || 800),
                          y: (overlay.y / 100) * (document.getElementById('canvas-preview-container')?.clientHeight || 800)
                        }}
                        size={{
                          width: `${overlay.width}%`,
                          height: `${overlay.height}%`
                        }}
                        onDragStart={() => setSelectedOverlayId(overlay.id)}
                        onDrag={(e, d) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            setImageOverlays(prev => prev.map(o => o.id === overlay.id ? {
                              ...o,
                              x: (d.x / parent.clientWidth) * 100,
                              y: (d.y / parent.clientHeight) * 100
                            } : o));
                          }
                        }}
                        onResize={(e, direction, ref, delta, position) => {
                          const parent = document.getElementById('canvas-preview-container');
                          if (parent) {
                            setImageOverlays(prev => prev.map(o => o.id === overlay.id ? {
                              ...o,
                              width: (ref.offsetWidth / parent.clientWidth) * 100,
                              height: (ref.offsetHeight / parent.clientHeight) * 100,
                              x: (position.x / parent.clientWidth) * 100,
                              y: (position.y / parent.clientHeight) * 100
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
        </>
      )}
    </div>
  );
}
