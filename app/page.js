'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import dynamic from 'next/dynamic';

const WorkspacePaintReveal = dynamic(
  () => import('@/components/ui/workspace-paint-reveal'),
  { ssr: false }
);

const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 800, height: 800 });
    };
    img.src = url;
  });
};

const PRESETS = [
  { id: 'canyon', name: 'Canyon', path: '/presets/canyon.jpg' },
  { id: 'sunset', name: 'Sunset', path: '/presets/sunset.jpg' },
  { id: 'coast', name: 'Coast', path: '/presets/coast.jpg' },
  { id: 'valley', name: 'Valley', path: '/presets/valley.jpg' },
  { id: 'cove', name: 'Cove', path: '/presets/cove.jpg' },
  { id: 'lake', name: 'Lake', path: '/presets/lake.jpg' },
  { id: 'cows', name: 'Cows', path: '/presets/cows.jpg' },
  { id: 'garden', name: 'Garden', path: '/presets/garden.jpg' },
  { id: 'yosemite', name: 'Yosemite', path: '/presets/yosemite.jpg' },
  { id: 'lofoten', name: 'Dock', path: '/presets/lofoten.jpg' },
  { id: 'daisies', name: 'Flowers', path: '/presets/daisies.jpg' },
];

export default function PixlateApp() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('Processed'); // Original, Processed
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (showEditor) {
      setTimeout(() => {
        const element = document.getElementById('editor-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  }, [showEditor]);

  // Custom Settings State
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const [sliderMaxWidth, setSliderMaxWidth] = useState(2000);
  const [sliderMaxHeight, setSliderMaxHeight] = useState(2000);
  const [whitePercent, setWhitePercent] = useState(0);
  const [colorSort, setColorSort] = useState(false);
  const [random, setRandom] = useState(0); // integer weight, 0 = off
  const [reverse, setReverse] = useState(false);
  const [sweep, setSweep] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0); // integer seed, 0 = off
  const [variations, setVariations] = useState(1);
  const [compress, setCompress] = useState(0);
  const [seeds, setSeeds] = useState('');

  // Post-Processing State
  const [colorOverlay, setColorOverlay] = useState(false);
  const [overlayColor, setOverlayColor] = useState('#ff0000');
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  const [overlayBlend, setOverlayBlend] = useState('multiply');
  const [vignette, setVignette] = useState(false);
  const [vignetteStrength, setVignetteStrength] = useState(50);
  const [scanLines, setScanLines] = useState(false);
  const [scanLineStrength, setScanLineStrength] = useState(20);
  const [crt, setCrt] = useState(false);
  const [chromatic, setChromatic] = useState(false);
  const [bloom, setBloom] = useState(false);
  const [characterBloom, setCharacterBloom] = useState(false);

  const handleReset = () => {
    // Tuning Reset
    setWhitePercent(0);
    setColorSort(false);
    setRandom(0);
    setReverse(false);
    setSweep(false);
    setRandomSeed(0);
    setVariations(1);
    setCompress(0);
    setSeeds('');

    // Post-Processing Reset
    setColorOverlay(false);
    setOverlayColor('#ff0000');
    setOverlayOpacity(30);
    setOverlayBlend('multiply');
    setVignette(false);
    setVignetteStrength(50);
    setScanLines(false);
    setScanLineStrength(20);
    setCrt(false);
    setChromatic(false);
    setBloom(false);
    setCharacterBloom(false);
  };

  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOutputUrl(null);
      setOutputBlob(null);
      setActiveTab('Processed');
      try {
        const dims = await getImageDimensions(file);
        setWidth(dims.width);
        setHeight(dims.height);
        setSliderMaxWidth(Math.max(2000, dims.width));
        setSliderMaxHeight(Math.max(2000, dims.height));
        await handleProcess(file, dims.width, dims.height, whitePercent, colorSort, random, reverse, sweep, randomSeed, variations, compress, seeds);
      } catch (err) {
        console.error("Failed to read image dimensions:", err);
        setWidth(800);
        setHeight(800);
        await handleProcess(file, 800, 800, whitePercent, colorSort, random, reverse, sweep, randomSeed, variations, compress, seeds);
      }
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Inspire Me / Load Sample Image Handler
  const handleInspireMe = async () => {
    if (PRESETS.length === 0) return;
    setLoading(true);
    try {
      const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
      const response = await fetch(randomPreset.path);
      if (!response.ok) throw new Error('Preset image not found on server');
      const blob = await response.blob();
      const file = new File([blob], `${randomPreset.id}.png`, { type: 'image/png' });
      setImage(file);
      setPreviewUrl(randomPreset.path);
      setOutputUrl(null);
      setOutputBlob(null);
      setActiveTab('Processed');
      const dims = await getImageDimensions(file);
      setWidth(dims.width);
      setHeight(dims.height);
      setSliderMaxWidth(Math.max(2000, dims.width));
      setSliderMaxHeight(Math.max(2000, dims.height));
      await handleProcess(file, dims.width, dims.height, whitePercent, colorSort, random, reverse, sweep, randomSeed, variations, compress, seeds);
    } catch (err) {
      alert('Failed to load preset image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = async (preset) => {
    setLoading(true);
    try {
      const response = await fetch(preset.path);
      if (!response.ok) throw new Error('Preset image not found on server');
      const blob = await response.blob();
      const file = new File([blob], `${preset.id}.png`, { type: 'image/png' });
      setImage(file);
      setPreviewUrl(preset.path);
      setOutputUrl(null);
      setOutputBlob(null);
      setActiveTab('Processed');
      const dims = await getImageDimensions(file);
      setWidth(dims.width);
      setHeight(dims.height);
      setSliderMaxWidth(Math.max(2000, dims.width));
      setSliderMaxHeight(Math.max(2000, dims.height));
      await handleProcess(file, dims.width, dims.height, whitePercent, colorSort, random, reverse, sweep, randomSeed, variations, compress, seeds);
    } catch (err) {
      alert('Failed to load preset image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (
    img = image,
    w = width,
    h = height,
    wp = whitePercent,
    cs = colorSort,
    rand = random,
    rev = reverse,
    sw = sweep,
    rs = randomSeed,
    varCount = variations,
    comp = compress,
    sd = seeds
  ) => {
    if (!img) return;
    setLoading(true);
    setActiveTab('Processed');

    const formData = new FormData();
    formData.append('image', img);
    formData.append('width', w);
    formData.append('height', h);
    formData.append('whitePercent', wp);
    formData.append('colorSort', cs);
    formData.append('random', rand);
    formData.append('reverse', rev);
    formData.append('sweep', sw);
    formData.append('randomSeed', rs);
    formData.append('variations', varCount);
    formData.append('compress', comp);
    formData.append('seeds', sd);

    try {
      const response = await fetch('/api/pixlate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const blob = await response.blob();
      setOutputBlob(blob);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert(err.message);
      setActiveTab('Comparison');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // SVG Filter for Chromatic Aberration needs to be applied to the Canvas?
      // Unfortunately, standard 2D Canvas doesn't easily support cross-origin SVG filters.
      // We will approximate it by drawing the image three times with slightly offset channels.
      if (chromatic) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';
        
        // Red channel (offset right)
        ctx.drawImage(img, 3, 0);
        
        // Green channel (center)
        ctx.drawImage(img, 0, 0);
        
        // Blue channel (offset left)
        ctx.drawImage(img, -3, 0);
        
        ctx.globalCompositeOperation = 'source-over';
        // Note: Full channel separation requires pixel manipulation which is slow.
        // For a simple approximation on canvas, this is basic but often used.
      } else {
        ctx.drawImage(img, 0, 0);
      }

      // Bloom effects
      if (bloom || characterBloom) {
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = canvas.width;
        blurCanvas.height = canvas.height;
        const bCtx = blurCanvas.getContext('2d');
        if (bloom) {
            bCtx.filter = 'blur(10px)';
            bCtx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.4;
            ctx.drawImage(blurCanvas, 0, 0);
        }
        if (characterBloom) {
            bCtx.filter = 'blur(40px)';
            bCtx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.5;
            ctx.drawImage(blurCanvas, 0, 0);
        }
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      }

      if (colorOverlay) {
        ctx.globalCompositeOperation = overlayBlend === 'overlay' ? 'overlay' : overlayBlend === 'screen' ? 'screen' : overlayBlend === 'color-burn' ? 'color-burn' : 'multiply';
        ctx.fillStyle = overlayColor;
        ctx.globalAlpha = overlayOpacity / 100;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      }

      if (vignette) {
        const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/1.5);
        gradient.addColorStop(0.4, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${vignetteStrength / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (scanLines) {
        ctx.fillStyle = `rgba(0,0,0,${scanLineStrength / 100})`;
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillRect(0, y, canvas.width, 2);
        }
      }

      // CRT Fallback
      if (crt) {
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'custom-pixlate.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = outputUrl;
  };

  const scrollToEditor = () => {
    setShowEditor(true);
  };

  const scrollToHero = () => {
    const element = document.getElementById('hero-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">

      {/* SVG Filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="chromatic">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feOffset in="red" dx="4" dy="0" result="redOffset" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
          <feOffset in="green" dx="0" dy="0" result="greenOffset" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feOffset in="blue" dx="-4" dy="0" result="blueOffset" />
          <feBlend mode="screen" in="redOffset" in2="greenOffset" result="rg" />
          <feBlend mode="screen" in="rg" in2="blueOffset" result="rgb" />
        </filter>
      </svg>

      {/* Hidden file input permanently mounted at the top-level container */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Hero Section (Top) */}
      <section id="hero-section" className="hero-section">
        <BackgroundRippleEffect />

        <div className="hero-content">

          <h1 className="hero-title">Pixlate Studio</h1>
          <p className="hero-subtitle">
            Professional-grade background patterns and gradients. Easily download and seamlessly integrate it into your projects.
          </p>
          <div className="hero-buttons">
            <button
              type="button"
              className="btn-primary"
              onClick={scrollToEditor}
              style={{ width: 'auto', padding: '14px 36px', fontSize: '14px' }}
            >
              Try it yourself
            </button>
            <Link
              href="/about"
              className="btn-secondary"
              style={{ width: 'auto', padding: '14px 36px', fontSize: '14px', display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
            >
              About the Project
            </Link>
          </div>
        </div>
      </section>

      {/* Editor & Studio Section (Bottom) */}
      {showEditor && (
        <section id="editor-section" className="editor-section">

        {/* Workspace Pane (Left) */}
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
                  <button
                    onClick={handleDownload}
                    className="btn-secondary"
                    style={{ width: 'auto', padding: '6px 16px', fontSize: '12px', height: '32px' }}
                  >
                    Download Image
                  </button>
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
                      <>
                        <img src={outputUrl} alt="Processed Image" className="main-image" style={{ filter: chromatic ? 'url(#chromatic)' : 'none' }} />
                        <div className={`effect-container ${crt ? 'effect-crt' : ''}`}>
                          {colorOverlay && <div className="effect-overlay effect-color-overlay"></div>}
                          {vignette && <div className="effect-overlay effect-vignette"></div>}
                          {scanLines && <div className="effect-overlay effect-scanlines"></div>}
                          {bloom && <img src={outputUrl} className="effect-overlay" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)', mixBlendMode: 'screen', opacity: 0.4 }} />}
                          {characterBloom && <img src={outputUrl} className="effect-overlay" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px)', mixBlendMode: 'screen', opacity: 0.5 }} />}
                        </div>
                      </>
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

        {/* Sidebar Pane (Right) */}
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
                <span>Width</span>
                <span className="control-value">{width}px</span>
              </div>
              <input
                type="range"
                min="100"
                max={sliderMaxWidth}
                step="50"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <span>Height</span>
                <span className="control-value">{height}px</span>
              </div>
              <input
                type="range"
                min="100"
                max={sliderMaxHeight}
                step="50"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Tuning Section */}
          <div className="section">
            <span className="section-title">Tuning</span>

            {/* White Threshold */}
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

            {/* Color Sorting Toggle */}
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

            {/* Random Weight Slider */}
            <div className="control-group">
              <div className="control-label-row">
                <span>Randomness Weight</span>
                <span className="control-value">{random === 0 ? 'Off' : random}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={random}
                onChange={(e) => setRandom(parseInt(e.target.value))}
              />
            </div>

            {/* Reverse Sort Toggle */}
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

            {/* Sweep Toggle */}
            <div className="toggle-row" onClick={() => setSweep(!sweep)}>
              <div className="toggle-info">
                <span className="toggle-title">Parameter Sweep</span>
                <span className="toggle-desc">Sweep across tuning properties</span>
              </div>
              <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={sweep}
                  onChange={(e) => setSweep(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Random Seed Input */}
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

            {/* Variations */}
            <div className="control-group">
              <div className="control-label-row">
                <span>Variations</span>
                <span className="control-value">{variations}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={variations}
                onChange={(e) => setVariations(parseInt(e.target.value))}
              />
            </div>

            {/* Compression */}
            <div className="control-group">
              <div className="control-label-row">
                <span>PNG Compression</span>
              </div>
              <select
                className="select-dropdown"
                value={compress}
                onChange={(e) => setCompress(parseInt(e.target.value))}
              >
                <option value="0">Default Compression</option>
                <option value="-1">No Compression</option>
                <option value="-2">Best Speed</option>
                <option value="-3">Best Compression</option>
              </select>
            </div>

            {/* Seeds Input */}
            <div className="control-group">
              <div className="control-label-row">
                <span>Custom Seed Positions</span>
              </div>
              <input
                type="text"
                className="text-input"
                value={seeds}
                onChange={(e) => setSeeds(e.target.value)}
                placeholder='e.g. "x y x y ..."'
              />
            </div>

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

              {/* Chromatic */}
              <div className="toggle-row" onClick={() => setChromatic(!chromatic)}>
                <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={chromatic} onChange={(e) => setChromatic(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
                <div className="toggle-info">
                  <span className="toggle-title" style={{ color: '#d4d4d8' }}>Chromatic</span>
                </div>
              </div>

              {/* Bloom */}
              <div className="toggle-row" onClick={() => setBloom(!bloom)}>
                <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={bloom} onChange={(e) => setBloom(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
                <div className="toggle-info">
                  <span className="toggle-title" style={{ color: '#d4d4d8' }}>Bloom</span>
                </div>
              </div>

              {/* Character Bloom */}
              <div className="toggle-row" onClick={() => setCharacterBloom(!characterBloom)}>
                <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={characterBloom} onChange={(e) => setCharacterBloom(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
                <div className="toggle-info">
                  <span className="toggle-title" style={{ color: '#d4d4d8' }}>Character Bloom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

        </section>
      )}

    </div>
  );
}
