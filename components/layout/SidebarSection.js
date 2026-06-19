'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePixlate, PRESETS, DIMENSION_PRESETS } from '@/context/PixlateContext';
import ToolbarCollapse from '@/components/ui/ToolbarCollapse';

export default function SidebarSection() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const {
    image, loading, previewUrl, handleSelectPreset, triggerFileInput, setShowEditor,
    dimensionPreset, setDimensionPreset, width, setWidth, height, setHeight,
    sliderMaxWidth, sliderMaxHeight,
    whitePercent, setWhitePercent, colorSort, setColorSort, reverse, setReverse, randomSeed, setRandomSeed,
    textOverlay, setTextOverlay, textOverlays, setTextOverlays, selectedTextId, setSelectedTextId,
    imageOverlay, setImageOverlay, overlayFileInputRef,
    colorOverlay, setColorOverlay, overlayColor, setOverlayColor, overlayOpacity, setOverlayOpacity, overlayBlend, setOverlayBlend,
    vignette, setVignette, vignetteStrength, setVignetteStrength,
    scanLines, setScanLines, scanLineStrength, setScanLineStrength,
    crt, setCrt, crtStrength, setCrtStrength,
    chromatic, setChromatic, chromaticStrength, setChromaticStrength,
    glitch, setGlitch, glitchStrength, setGlitchStrength,
    blur, setBlur, blurStrength, setBlurStrength,
    halftone, setHalftone, halftoneSize, setHalftoneSize,
    coverage, setCoverage, edgeEmphasis, setEdgeEmphasis, density, setDensity, brightness, setBrightness, contrast, setContrast, borderRadius, setBorderRadius,
    variations, setVariations,
    handleReset, handleProcess
  } = usePixlate();

  if (isCollapsed) {
    return (
      <aside className="sidebar" style={{ width: '60px', padding: '20px 0', alignItems: 'center', transition: 'width 0.2s' }}>
        <button
          onClick={() => setIsCollapsed(false)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '8px' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="sidebar" style={{ transition: 'width 0.2s' }}>

      {/* Header */}
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }} ref={menuRef}>
        <span
          className="sidebar-title"
        >
          Pixlate
        </span>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '0',
            backgroundColor: '#1c1c1e',
            border: '1px solid #27272a',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            width: '200px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '6px 0'
          }}>
            <button
              onClick={() => { setIsCollapsed(true); setIsMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'transparent', border: 'none', color: '#e4e4e7', width: '100%', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              Collapse Toolbar
            </button>
            <div style={{ height: '1px', backgroundColor: '#27272a', margin: '4px 0' }}></div>

            <a
              href="https://github.com/arnabjena007/PixlateWeb/issues" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', color: '#a1a1aa', width: '100%', cursor: 'pointer', fontSize: '13px' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              Report a Bug
            </a>
            <a
              href="https://github.com/arnabjena007/PixlateWeb/issues" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', color: '#a1a1aa', width: '100%', cursor: 'pointer', fontSize: '13px' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Suggest a Feature
            </a>

            <div style={{ height: '1px', backgroundColor: '#27272a', margin: '4px 0' }}></div>

            <button
              onClick={() => { setShowEditor(false); setIsMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'transparent', border: 'none', color: '#a1a1aa', width: '100%', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Landing page
            </button>
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', color: '#a1a1aa', width: '100%', cursor: 'pointer', fontSize: '13px' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Changelog
            </Link>
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', color: '#a1a1aa', width: '100%', cursor: 'pointer', fontSize: '13px' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              Privacy
            </Link>
            <Link
              href="/about"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', color: '#a1a1aa', width: '100%', cursor: 'pointer', fontSize: '13px' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              About
            </Link>
          </div>
        )}
      </div>

      {/* Backgrounds Section */}
      <ToolbarCollapse title="Backgrounds">

        <div className="presets-grid">
          {PRESETS.map((preset) => (
            <div
              key={preset.id}
              className={`preset-thumbnail ${previewUrl === preset.path ? 'active' : ''}`}
              onClick={() => handleSelectPreset(preset)}
              title={preset.name}
            >
              <img src={preset.path} alt={preset.name} />
            </div>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px', marginBottom: '12px', textAlign: 'left' }}>
          Presets by <a href="https://x.com/mandolinaes" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#a1a1aa'}>mandolinaes</a>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={triggerFileInput}
        >
          Upload Custom Image
        </button>
      </ToolbarCollapse>

      {/* Dimensions Section */}
      <ToolbarCollapse title="Dimensions">

        <div className="control-group">
          <div className="control-label-row">
            <span>Preset</span>
          </div>
          <select
            className="select-dropdown"
            value={dimensionPreset}
            onChange={(e) => {
              const presetName = e.target.value;
              setDimensionPreset(presetName);
              if (presetName !== 'Custom Size') {
                const preset = DIMENSION_PRESETS.find(p => p.name === presetName);
                if (preset) {
                  setWidth(preset.width);
                  setHeight(preset.height);
                  handleProcess(undefined, preset.width, preset.height);
                }
              }
            }}
            style={{ marginBottom: '12px' }}
          >
            {DIMENSION_PRESETS.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name} {preset.width ? `(${preset.width} × ${preset.height})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Width</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                value={width}
                onChange={(e) => { 
                  const val = parseInt(e.target.value);
                  setWidth(isNaN(val) ? '' : val); 
                  setDimensionPreset('Custom Size'); 
                }}
                onBlur={(e) => {
                  let val = parseInt(e.target.value);
                  if (!val || val < 10) val = 800;
                  setWidth(val);
                  handleProcess(undefined, val, height);
                }}
                style={{ width: '60px', textAlign: 'right', background: 'transparent', border: '1px solid #3f3f46', color: 'var(--text-primary)', borderRadius: '4px', padding: '2px 4px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>px</span>
            </div>
          </div>
          <input
            type="range"
            min="100"
            max={sliderMaxWidth}
            step="50"
            value={width}
            onChange={(e) => { setWidth(parseInt(e.target.value)); setDimensionPreset('Custom Size'); }}
            onMouseUp={(e) => handleProcess(undefined, parseInt(e.target.value), height)}
            onTouchEnd={(e) => handleProcess(undefined, parseInt(e.target.value), height)}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Height</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                value={height}
                onChange={(e) => { 
                  const val = parseInt(e.target.value);
                  setHeight(isNaN(val) ? '' : val); 
                  setDimensionPreset('Custom Size'); 
                }}
                onBlur={(e) => {
                  let val = parseInt(e.target.value);
                  if (!val || val < 10) val = 800;
                  setHeight(val);
                  handleProcess(undefined, width, val);
                }}
                style={{ width: '60px', textAlign: 'right', background: 'transparent', border: '1px solid #3f3f46', color: 'var(--text-primary)', borderRadius: '4px', padding: '2px 4px', fontSize: '12px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>px</span>
            </div>
          </div>
          <input
            type="range"
            min="100"
            max={sliderMaxHeight}
            step="50"
            value={height}
            onChange={(e) => { setHeight(parseInt(e.target.value)); setDimensionPreset('Custom Size'); }}
            onMouseUp={(e) => handleProcess(undefined, width, parseInt(e.target.value))}
            onTouchEnd={(e) => handleProcess(undefined, width, parseInt(e.target.value))}
          />
        </div>
      </ToolbarCollapse>

      {/* Tuning Section */}
      <ToolbarCollapse title="Tuning">

        <div className="control-group">
          <div className="control-label-row">
            <span>White Threshold</span>
            <span className="control-value">{whitePercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={whitePercent}
            onChange={(e) => setWhitePercent(parseInt(e.target.value))}
          />
        </div>

        <div className="toggle-row" onClick={() => setColorSort(!colorSort)}>
          <div className="toggle-info">
            <span className="toggle-title">Color Sorting</span>
            <span className="toggle-desc">Sort pixels by brightness</span>
          </div>
          <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={colorSort}
              onChange={(e) => setColorSort(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="toggle-row" onClick={() => setReverse(!reverse)}>
          <div className="toggle-info">
            <span className="toggle-title">Reverse Order</span>
            <span className="toggle-desc">Invert pixel sort direction</span>
          </div>
          <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={reverse}
              onChange={(e) => setReverse(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Random Seed</span>
            <span className="control-value">{randomSeed === 0 ? 'Off' : randomSeed}</span>
          </div>
          <input
            type="range"
            min="0"
            max="9999"
            step="1"
            value={randomSeed}
            onChange={(e) => setRandomSeed(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group" style={{ marginTop: '16px' }}>
          <div className="control-label-row">
            <span>Algorithm Variation</span>
          </div>
          <select
            className="select-dropdown"
            value={variations}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setVariations(val);
              handleProcess(undefined, undefined, undefined, undefined, undefined, undefined, undefined, val);
            }}
            style={{ marginBottom: '8px' }}
          >
            <option value={1}>Standard Processing</option>
            <option value={2}>Two Seed Points</option>
            <option value={7}>Average Selection</option>
            <option value={4}>Poisson-disc Sampling</option>
          </select>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', fontStyle: 'italic' }}>
            {variations === 1 && "The default generation method starting from the center."}
            {variations === 2 && "As before, but with two seed points placed in opposite corners of the canvas."}
            {variations === 7 && "Colors shuffled randomly and placed via average selection."}
            {variations === 4 && "Seed points scattered across the canvas using poisson-disc sampling."}
          </div>
        </div>

      </ToolbarCollapse>

      {/* Text Overlay Section */}
      <ToolbarCollapse title="Text Overlay">

        <div className="toggle-row" onClick={() => setTextOverlay(!textOverlay)}>
          <div className="toggle-info">
            <span className="toggle-title">Enable Text</span>
            <span className="toggle-desc">Add text to the center</span>
          </div>
          <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={textOverlay} onChange={(e) => setTextOverlay(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {textOverlay && (
          <div className="control-group" style={{ paddingLeft: '10px', paddingBottom: '8px', paddingTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                const newText = {
                  id: Date.now().toString(),
                  value: 'NEW TEXT',
                  font: 'Instrument Serif',
                  size: 'Medium',
                  color: '#ffffff',
                  bold: true,
                  italic: false,
                  underline: false,
                  front: true,
                  x: 50,
                  y: 50,
                };
                setTextOverlays([...textOverlays, newText]);
                setSelectedTextId(newText.id);
              }}
              style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
            >
              Add Text Overlay
            </button>

            {selectedTextId && textOverlays.find(t => t.id === selectedTextId) && (() => {
              const selectedText = textOverlays.find(t => t.id === selectedTextId);
              const updateText = (updates) => {
                setTextOverlays(textOverlays.map(t => t.id === selectedTextId ? { ...t, ...updates } : t));
              };
              return (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <input type="text" className="text-input" value={selectedText.value} onChange={(e) => updateText({ value: e.target.value })} placeholder="Enter text..." style={{ width: '100%', marginBottom: '12px' }} />

                  <div className="control-label-row">
                    <span>Font Family</span>
                  </div>
                  <select className="select-dropdown" value={selectedText.font} onChange={(e) => updateText({ font: e.target.value })} style={{ marginBottom: '12px' }}>
                    <option value="Instrument Serif">Instrument Serif</option>
                    <option value="Geist">Geist</option>
                    <option value="Arial">Arial</option>
                    <option value="Impact">Impact</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>

                  <div className="control-label-row">
                    <span>Size</span>
                  </div>
                  <select className="select-dropdown" value={selectedText.size} onChange={(e) => updateText({ size: e.target.value })} style={{ marginBottom: '12px' }}>
                    <option value="Small">Small (50px)</option>
                    <option value="Medium">Medium (70px)</option>
                    <option value="Large">Large (150px)</option>
                    <option value="Extra Large">Extra Large (250ipx)</option>
                  </select>

                  <div className="control-label-row">
                    <span>Color</span>
                    <input type="color" value={selectedText.color} onChange={(e) => updateText({ color: e.target.value })} style={{ width: '30px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className={`tab-btn ${selectedText.bold ? 'active' : ''}`} onClick={() => updateText({ bold: !selectedText.bold })} style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 'bold', flex: 1 }}>B</button>
                    <button className={`tab-btn ${selectedText.italic ? 'active' : ''}`} onClick={() => updateText({ italic: !selectedText.italic })} style={{ padding: '6px 12px', fontSize: '14px', fontStyle: 'italic', flex: 1 }}>I</button>
                    <button className={`tab-btn ${selectedText.underline ? 'active' : ''}`} onClick={() => updateText({ underline: !selectedText.underline })} style={{ padding: '6px 12px', fontSize: '14px', textDecoration: 'underline', flex: 1 }}>U</button>
                  </div>

                  <div className="control-label-row" style={{ marginTop: '16px', marginBottom: '8px' }}>
                    <span>Layer Position</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className={`tab-btn ${selectedText.front ? 'active' : ''}`}
                      onClick={() => updateText({ front: true })}
                      title="Bring to Front"
                      style={{ padding: '8px', fontSize: '12px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      In front of img
                    </button>
                    <button
                      className={`tab-btn ${!selectedText.front ? 'active' : ''}`}
                      onClick={() => updateText({ front: false })}
                      title="Send to Back"
                      style={{ padding: '8px', fontSize: '12px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      Behind img
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </ToolbarCollapse>


      {/* Image Overlay Section */}
      <ToolbarCollapse title="Image Overlay">

        <div className="toggle-row" onClick={() => setImageOverlay(!imageOverlay)}>
          <div className="toggle-info">
            <span className="toggle-title">Enable Image</span>
            <span className="toggle-desc">Add a custom image</span>
          </div>
          <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={imageOverlay} onChange={(e) => setImageOverlay(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {imageOverlay && (
          <div className="control-group" style={{ paddingLeft: '10px', paddingBottom: '8px', paddingTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => overlayFileInputRef.current && overlayFileInputRef.current.click()}
              style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
            >
              Add Image Overlay
            </button>
          </div>
        )}
      </ToolbarCollapse>


      {/* Intensity Section */}
      <ToolbarCollapse title="Intensity">

        <div className="control-group">
          <div className="control-label-row">
            <span>Coverage</span>
            <span className="control-value">{coverage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={coverage}
            onChange={(e) => setCoverage(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Edge Emphasis</span>
            <span className="control-value">{edgeEmphasis}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={edgeEmphasis}
            onChange={(e) => setEdgeEmphasis(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Density</span>
            <span className="control-value">{density}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={density}
            onChange={(e) => setDensity(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Brightness</span>
            <span className="control-value">{brightness}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Contrast</span>
            <span className="control-value">{contrast}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Rounded Corner</span>
            <span className="control-value">{borderRadius}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={borderRadius}
            onChange={(e) => setBorderRadius(parseInt(e.target.value))}
          />
        </div>

      </ToolbarCollapse>


      {/* Post-Processing Section */}
      <ToolbarCollapse title="Post-Processing">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Color Overlay */}
          <div className="toggle-row" onClick={() => setColorOverlay(!colorOverlay)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={colorOverlay} onChange={(e) => setColorOverlay(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Color Overlay</span>
            </div>
          </div>
          {colorOverlay && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <div className="control-label-row">
                <span>Color</span>
                <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} style={{ width: '30px', height: '20px', padding: 0, border: 'none', cursor: 'pointer' }} />
              </div>
              <div className="control-label-row">
                <span>Opacity</span>
                <span className="control-value">{overlayOpacity}%</span>
              </div>
              <input type="range" min="0" max="100" value={overlayOpacity} onChange={(e) => setOverlayOpacity(parseInt(e.target.value))} />
              <div className="control-label-row" style={{ marginTop: '4px' }}>
                <span>Blend</span>
              </div>
              <select className="select-dropdown" value={overlayBlend} onChange={(e) => setOverlayBlend(e.target.value)}>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="color-burn">Color Burn</option>
              </select>
            </div>
          )}

          {/* Vignette */}
          <div className="toggle-row" onClick={() => setVignette(!vignette)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={vignette} onChange={(e) => setVignette(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: vignette ? '0 0 auto' : 1, minWidth: '70px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Vignette</span>
            </div>
            {vignette && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="0" max="100" value={vignetteStrength} onChange={(e) => setVignetteStrength(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>

          {/* Scan Lines */}
          <div className="toggle-row" onClick={() => setScanLines(!scanLines)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={scanLines} onChange={(e) => setScanLines(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: scanLines ? '0 0 auto' : 1, minWidth: '70px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Scan Lines</span>
            </div>
            {scanLines && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="0" max="100" value={scanLineStrength} onChange={(e) => setScanLineStrength(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>

          {/* CRT Curvature */}
          <div className="toggle-row" onClick={() => setCrt(!crt)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={crt} onChange={(e) => setCrt(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: crt ? '0 0 auto' : 1, minWidth: '95px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>CRT Curvature</span>
            </div>
            {crt && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="0" max="100" value={crtStrength} onChange={(e) => setCrtStrength(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>

          {/* RGB Split (formerly Chromatic) */}
          <div className="toggle-row" onClick={() => setChromatic(!chromatic)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={chromatic} onChange={(e) => setChromatic(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: chromatic ? '0 0 auto' : 1, minWidth: '70px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>RGB Split</span>
            </div>
            {chromatic && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="1" max="20" value={chromaticStrength} onChange={(e) => setChromaticStrength(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>

          {/* Glitch */}
          <div className="toggle-row" onClick={() => setGlitch(!glitch)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={glitch} onChange={(e) => setGlitch(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: glitch ? '0 0 auto' : 1, minWidth: '50px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Glitch</span>
            </div>
            {glitch && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="1" max="50" value={glitchStrength} onChange={(e) => setGlitchStrength(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>

          {/* Blur */}
          <div className="toggle-row" onClick={() => setBlur(!blur)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={blur} onChange={(e) => setBlur(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: blur ? '0 0 auto' : 1, minWidth: '40px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Blur</span>
            </div>
            {blur && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="1" max="20" value={blurStrength} onChange={(e) => setBlurStrength(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>

          {/* Halftone */}
          <div className="toggle-row" onClick={() => setHalftone(!halftone)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={halftone} onChange={(e) => setHalftone(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info" style={{ flex: halftone ? '0 0 auto' : 1, minWidth: '60px' }}>
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Halftone</span>
            </div>
            {halftone && (
              <div style={{ flex: 1, paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <input type="range" min="2" max="20" value={halftoneSize} onChange={(e) => setHalftoneSize(parseInt(e.target.value))} style={{ width: '100%', margin: 0 }} />
              </div>
            )}
          </div>
        </div>
      </ToolbarCollapse>


      {/* Action Buttons */}
      <div className="section" style={{ marginTop: 'auto', gap: '8px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleReset}
          style={{ width: '100%' }}
        >
          Reset to Defaults
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={loading || !image}
          onClick={() => handleProcess()}
          style={{ width: '100%' }}
        >
          {loading ? 'Processing...' : 'Process Changes'}
        </button>
      </div>

    </aside>
  );
}
