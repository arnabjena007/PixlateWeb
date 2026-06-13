'use client';
import { usePixlate, PRESETS, DIMENSION_PRESETS } from '@/context/PixlateContext';

export default function SidebarSection() {
  const {
    image, loading, previewUrl, scrollToHero, handleSelectPreset, triggerFileInput,
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
    filmGrain, setFilmGrain, grainStrength, setGrainStrength,
    halftone, setHalftone, halftoneSize, setHalftoneSize,
    filmDust, setFilmDust, dustAmount, setDustAmount,
    handleReset, handleProcess
  } = usePixlate();

  return (
    <aside className="sidebar">

      {/* Header */}
      <div className="sidebar-header">
        <span
          className="sidebar-title"
          onClick={scrollToHero}
          style={{ cursor: 'pointer' }}
        >
          Pixlate Studio
        </span>
      </div>

      {/* Backgrounds Section */}
      <div className="section">
        <span className="section-title">Backgrounds</span>

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

        <button
          type="button"
          className="btn-secondary"
          onClick={triggerFileInput}
        >
          Upload Custom Image
        </button>
      </div>

      {/* Dimensions Section */}
      <div className="section">
        <span className="section-title">Dimensions</span>

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
                onChange={(e) => { setWidth(parseInt(e.target.value) || 0); setDimensionPreset('Custom Size'); }}
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
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span>Height</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                value={height}
                onChange={(e) => { setHeight(parseInt(e.target.value) || 0); setDimensionPreset('Custom Size'); }}
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
          />
        </div>
      </div>

      {/* Tuning Section */}
      <div className="section">
        <span className="section-title">Tuning</span>

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

      </div>

      {/* Text Overlay Section */}
      <div className="section">
        <span className="section-title">Text Overlay</span>

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
                    <option value="Small">Small (30px)</option>
                    <option value="Medium">Medium (70px)</option>
                    <option value="Large">Large (150px)</option>
                    <option value="Extra Large">Extra Large (300px)</option>
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
                      style={{ padding: '8px', fontSize: '14px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="8" y="8" width="14" height="14" rx="2" ry="2" fill="currentColor" fillOpacity="0.8" stroke="none"></rect>
                        <rect x="2" y="2" width="14" height="14" rx="2" ry="2"></rect>
                      </svg>
                      Front
                    </button>
                    <button 
                      className={`tab-btn ${!selectedText.front ? 'active' : ''}`} 
                      onClick={() => updateText({ front: false })} 
                      title="Send to Back"
                      style={{ padding: '8px', fontSize: '14px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="14" height="14" rx="2" ry="2" fill="currentColor" fillOpacity="0.8" stroke="none"></rect>
                        <rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect>
                      </svg>
                      Back
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>


      {/* Image Overlay Section */}
      <div className="section">
        <span className="section-title">Image Overlay</span>

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
      </div>


      {/* Post-Processing Section */}
      <div className="section">
        <span className="section-title">Post-Processing</span>

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
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Vignette</span>
            </div>
          </div>
          {vignette && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="0" max="100" value={vignetteStrength} onChange={(e) => setVignetteStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* Scan Lines */}
          <div className="toggle-row" onClick={() => setScanLines(!scanLines)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={scanLines} onChange={(e) => setScanLines(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Scan Lines</span>
            </div>
          </div>
          {scanLines && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="0" max="100" value={scanLineStrength} onChange={(e) => setScanLineStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* CRT Curvature */}
          <div className="toggle-row" onClick={() => setCrt(!crt)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={crt} onChange={(e) => setCrt(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>CRT Curvature</span>
            </div>
          </div>
          {crt && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="0" max="100" value={crtStrength} onChange={(e) => setCrtStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* RGB Split (formerly Chromatic) */}
          <div className="toggle-row" onClick={() => setChromatic(!chromatic)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={chromatic} onChange={(e) => setChromatic(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>RGB Split</span>
            </div>
          </div>
          {chromatic && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="1" max="20" value={chromaticStrength} onChange={(e) => setChromaticStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* Glitch */}
          <div className="toggle-row" onClick={() => setGlitch(!glitch)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={glitch} onChange={(e) => setGlitch(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Glitch</span>
            </div>
          </div>
          {glitch && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="1" max="50" value={glitchStrength} onChange={(e) => setGlitchStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* Blur */}
          <div className="toggle-row" onClick={() => setBlur(!blur)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={blur} onChange={(e) => setBlur(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Blur</span>
            </div>
          </div>
          {blur && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="1" max="20" value={blurStrength} onChange={(e) => setBlurStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* Film Grain */}
          <div className="toggle-row" onClick={() => setFilmGrain(!filmGrain)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={filmGrain} onChange={(e) => setFilmGrain(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Film Grain</span>
            </div>
          </div>
          {filmGrain && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="1" max="100" value={grainStrength} onChange={(e) => setGrainStrength(parseInt(e.target.value))} />
            </div>
          )}

          {/* Halftone */}
          <div className="toggle-row" onClick={() => setHalftone(!halftone)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={halftone} onChange={(e) => setHalftone(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Halftone</span>
            </div>
          </div>
          {halftone && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="2" max="20" value={halftoneSize} onChange={(e) => setHalftoneSize(parseInt(e.target.value))} />
            </div>
          )}

          {/* Film Dust */}
          <div className="toggle-row" onClick={() => setFilmDust(!filmDust)}>
            <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={filmDust} onChange={(e) => setFilmDust(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-info">
              <span className="toggle-title" style={{ color: '#d4d4d8' }}>Film Dust</span>
            </div>
          </div>
          {filmDust && (
            <div className="control-group" style={{ paddingLeft: '40px', paddingBottom: '8px' }}>
              <input type="range" min="1" max="100" value={dustAmount} onChange={(e) => setDustAmount(parseInt(e.target.value))} />
            </div>
          )}
        </div>
      </div>


      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
