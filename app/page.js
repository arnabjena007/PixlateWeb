'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import dynamic from 'next/dynamic';
import { Rnd } from 'react-rnd';

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

const DIMENSION_PRESETS = [
  { name: 'Custom Size', width: null, height: null },
  { name: 'Instagram Post', width: 1080, height: 1350 },
  { name: 'Facebook Post', width: 940, height: 788 },
  { name: 'Facebook Page Cover', width: 851, height: 315 },
  { name: 'Facebook Event Cover', width: 1920, height: 1080 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'YouTube Banner', width: 2560, height: 1440 },
  { name: 'LinkedIn Background Photo', width: 1584, height: 396 },
  { name: 'LinkedIn Post', width: 1200, height: 1200 },
  { name: 'Pinterest Pin', width: 1000, height: 1500 },
  { name: 'Twitter Post', width: 1600, height: 900 },
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
  const [dimensionPreset, setDimensionPreset] = useState('Custom Size');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const [sliderMaxWidth, setSliderMaxWidth] = useState(2000);
  const [sliderMaxHeight, setSliderMaxHeight] = useState(2000);
  const [whitePercent, setWhitePercent] = useState(0);
  const [colorSort, setColorSort] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0); // integer seed, 0 = off
  const [variations, setVariations] = useState(1);

  // Text Overlay State
  const [textOverlay, setTextOverlay] = useState(false);
  const [textValue, setTextValue] = useState('PIXLATE');
  const [textFont, setTextFont] = useState('Instrument Serif');
  const [textSize, setTextSize] = useState(150);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBold, setTextBold] = useState(true);
  const [textItalic, setTextItalic] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);

  // Image Overlay State
  const [imageOverlay, setImageOverlay] = useState(false);
  const [imageOverlays, setImageOverlays] = useState([]);
  const [selectedOverlayId, setSelectedOverlayId] = useState(null);

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
  const [crtStrength, setCrtStrength] = useState(20);
  const [chromatic, setChromatic] = useState(false);
  const [chromaticStrength, setChromaticStrength] = useState(4);
  const [glitch, setGlitch] = useState(false);
  const [glitchStrength, setGlitchStrength] = useState(10);
  const [blur, setBlur] = useState(false);
  const [blurStrength, setBlurStrength] = useState(5);
  const [filmGrain, setFilmGrain] = useState(false);
  const [grainStrength, setGrainStrength] = useState(15);
  const [halftone, setHalftone] = useState(false);
  const [halftoneSize, setHalftoneSize] = useState(4);
  const [filmDust, setFilmDust] = useState(false);
  const [dustAmount, setDustAmount] = useState(30);

  const handleReset = () => {
    // Text Overlay Reset
    setTextOverlay(false);
    setTextValue('PIXLATE');
    setTextFont('Instrument Serif');
    setTextSize(150);
    setTextColor('#ffffff');
    setTextBold(true);
    setTextItalic(false);
    setTextUnderline(false);

    // Image Overlay Reset
    setImageOverlay(false);
    setImageOverlays([]);
    setSelectedOverlayId(null);

    // Tuning Reset
    setWhitePercent(0);
    setColorSort(false);
    setReverse(false);
    setRandomSeed(0);
    setVariations(1);

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
    setCrtStrength(20);
    setChromatic(false);
    setChromaticStrength(4);
    setGlitch(false);
    setGlitchStrength(10);
    setBlur(false);
    setBlurStrength(5);
    setFilmGrain(false);
    setGrainStrength(15);
    setHalftone(false);
    setHalftoneSize(4);
    setFilmDust(false);
    setDustAmount(30);
  };

  const fileInputRef = useRef(null);
  const overlayFileInputRef = useRef(null);

  const handleOverlayFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      const newOverlay = {
        id: Date.now().toString(),
        url,
        x: 25,
        y: 25,
        width: 50,
        height: 50
      };
      setImageOverlays(prev => [...prev, newOverlay]);
      setSelectedOverlayId(newOverlay.id);
    }
    if (e.target) e.target.value = '';
  };

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
        await handleProcess(file, dims.width, dims.height, whitePercent, colorSort, reverse, randomSeed, variations);
      } catch (err) {
        console.error("Failed to read image dimensions:", err);
        setWidth(800);
        setHeight(800);
        await handleProcess(file, 800, 800, whitePercent, colorSort, reverse, randomSeed, variations);
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
      await handleProcess(file, dims.width, dims.height, whitePercent, colorSort, reverse, randomSeed, variations);
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
      await handleProcess(file, dims.width, dims.height, whitePercent, colorSort, reverse, randomSeed, variations);
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
    rev = reverse,
    rs = randomSeed,
    varCount = variations
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
    formData.append('random', 0);
    formData.append('reverse', rev);
    formData.append('sweep', false);
    formData.append('randomSeed', rs);
    formData.append('variations', varCount);
    formData.append('compress', 0);
    formData.append('seeds', '');

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

      if (blur) {
        ctx.filter = `blur(${blurStrength}px)`;
      } else {
        ctx.filter = 'none';
      }

      if (chromatic) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(img, chromaticStrength * 2, 0);
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(img, -chromaticStrength * 2, 0);
        ctx.globalCompositeOperation = 'source-over';
      } else if (glitch) {
        ctx.drawImage(img, 0, 0);
        const sliceCount = glitchStrength * 2;
        for (let i = 0; i < sliceCount; i++) {
          const y = Math.random() * canvas.height;
          const h = Math.random() * (canvas.height / 15);
          const xOffset = (Math.random() - 0.5) * glitchStrength * 4;
          ctx.drawImage(img, 0, y, canvas.width, h, xOffset, y, canvas.width, h);
        }
      } else {
        ctx.drawImage(img, 0, 0);
      }

      ctx.filter = 'none';

      if (colorOverlay) {
        ctx.globalCompositeOperation = overlayBlend === 'overlay' ? 'overlay' : overlayBlend === 'screen' ? 'screen' : overlayBlend === 'color-burn' ? 'color-burn' : 'multiply';
        ctx.fillStyle = overlayColor;
        ctx.globalAlpha = overlayOpacity / 100;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      }

      if (vignette) {
        const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5);
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

      if (crt) {
        ctx.fillStyle = `rgba(0,0,0,${crtStrength / 100})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(canvas.width / 2, 20, canvas.width, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 20, 0, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      if (filmGrain) {
        ctx.fillStyle = `rgba(128,128,128,${grainStrength / 100})`;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      if (halftone) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.globalCompositeOperation = 'overlay';
        const s = halftoneSize * 2;
        for (let y = 0; y < canvas.height; y += s) {
          for (let x = 0; x < canvas.width; x += s) {
            ctx.beginPath();
            ctx.arc(x + s / 2, y + s / 2, halftoneSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      if (filmDust) {
        ctx.fillStyle = `rgba(255,255,255,${dustAmount / 100})`;
        ctx.globalCompositeOperation = 'overlay';
        for (let i = 0; i < dustAmount * 20; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      if (textOverlay && textValue) {
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let fontString = '';
        if (textItalic) fontString += 'italic ';
        if (textBold) fontString += 'bold ';
        fontString += `${textSize}px "${textFont}", sans-serif`;
        ctx.font = fontString;
        ctx.fillText(textValue, canvas.width / 2, canvas.height / 2);

        if (textUnderline) {
          const textMetrics = ctx.measureText(textValue);
          const textWidth = textMetrics.width;
          ctx.fillRect(canvas.width / 2 - textWidth / 2, canvas.height / 2 + textSize / 2 - (textSize * 0.1), textWidth, textSize / 15);
        }
      }

      const exportCanvas = () => {
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

      const drawOverlaysAndExport = async () => {
        if (imageOverlay && imageOverlays.length > 0) {
          for (const overlay of imageOverlays) {
            await new Promise((resolve) => {
              const overlayImg = new Image();
              overlayImg.crossOrigin = "anonymous";
              overlayImg.onload = () => {
                const overlayW = canvas.width * (overlay.width / 100);
                const overlayH = canvas.height * (overlay.height / 100);
                const x = canvas.width * (overlay.x / 100);
                const y = canvas.height * (overlay.y / 100);
                ctx.drawImage(overlayImg, x, y, overlayW, overlayH);
                resolve();
              };
              overlayImg.src = overlay.url;
            });
          }
        }
        exportCanvas();
      };
      
      drawOverlaysAndExport();
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
          <feOffset in="red" dx={chromaticStrength * 2} dy="0" result="redOffset" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
          <feOffset in="green" dx="0" dy="0" result="greenOffset" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feOffset in="blue" dx={-chromaticStrength * 2} dy="0" result="blueOffset" />
          <feBlend mode="screen" in="redOffset" in2="greenOffset" result="rg" />
          <feBlend mode="screen" in="rg" in2="blueOffset" result="rgb" />
        </filter>
        <filter id="glitch">
          <feTurbulence type="fractalNoise" baseFrequency={`0 ${glitchStrength / 100}`} numOctaves="1" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="noise" result="coloredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale={glitchStrength * 2} xChannelSelector="R" yChannelSelector="G" />
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
      <input
        ref={overlayFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleOverlayFileChange}
        style={{ display: 'none' }}
      />

      {/* Hero Section (Top) */}
      <section id="hero-section" className="hero-section">
        <BackgroundRippleEffect />

        <div className="hero-content">

          <a
            href="https://github.com/arnabjena007/PixlateWeb"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-badge"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s', zIndex: 10, color: 'var(--text-muted)' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <svg height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            Star on GitHub
          </a>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          const newSeed = Math.floor(Math.random() * 9999) + 1;
                          setRandomSeed(newSeed);
                          handleProcess(image, width, height, whitePercent, colorSort, random, reverse, sweep, newSeed, variations, compress, seeds);
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
                        <div 
                          id="canvas-preview-container" 
                          className="effect-container" 
                          style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseDown={(e) => {
                            if (e.target.id === 'canvas-preview-container' || e.target.classList.contains('preview-image') || e.target.classList.contains('effect-overlay')) {
                              setSelectedOverlayId(null);
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
                            '--grain-opacity': grainStrength / 100,
                            '--halftone-size': `${halftoneSize}px`,
                            '--dust-opacity': dustAmount / 100,
                            '--scanline-opacity': scanLineStrength / 100,
                            '--vignette-opacity': vignetteStrength / 100
                          }}>
                            {colorOverlay && <div className="effect-overlay effect-color-overlay" style={{ '--overlay-color': overlayColor, '--overlay-opacity': overlayOpacity / 100, '--overlay-blend': overlayBlend }}></div>}
                            {vignette && <div className="effect-overlay effect-vignette"></div>}
                            {scanLines && <div className="effect-overlay effect-scanlines"></div>}
                            {filmGrain && <div className="effect-overlay effect-film-grain"></div>}
                            {halftone && <div className="effect-overlay effect-halftone"></div>}
                            {filmDust && <div className="effect-overlay effect-film-dust"></div>}
                          </div>

                          {textOverlay && textValue && (
                            <div style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) scale(${Math.min(1, 800 / Math.max(width || 1, 1))})`,
                              transformOrigin: 'center',
                              fontFamily: `"${textFont}", sans-serif`,
                              fontSize: `${textSize}px`,
                              color: textColor,
                              fontWeight: textBold ? 'bold' : 'normal',
                              fontStyle: textItalic ? 'italic' : 'normal',
                              textDecoration: textUnderline ? 'underline' : 'none',
                              pointerEvents: 'none',
                              whiteSpace: 'nowrap',
                              zIndex: 10
                            }}>
                              {textValue}
                            </div>
                          )}

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
                              lockAspectRatio={true}
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
                                    top: '-30px',
                                    right: '0',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    zIndex: 20
                                  }}
                                >
                                  Remove
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
                  <input type="text" className="text-input" value={textValue} onChange={(e) => setTextValue(e.target.value)} placeholder="Enter text..." style={{ width: '100%', marginBottom: '12px' }} />

                  <div className="control-label-row">
                    <span>Font Family</span>
                  </div>
                  <select className="select-dropdown" value={textFont} onChange={(e) => setTextFont(e.target.value)} style={{ marginBottom: '12px' }}>
                    <option value="Instrument Serif">Instrument Serif</option>
                    <option value="Geist">Geist</option>
                    <option value="Arial">Arial</option>
                    <option value="Impact">Impact</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>

                  <div className="control-label-row">
                    <span>Size</span>
                    <span className="control-value">{textSize}px</span>
                  </div>
                  <input type="range" min="10" max="500" value={textSize} onChange={(e) => setTextSize(parseInt(e.target.value))} style={{ marginBottom: '12px' }} />

                  <div className="control-label-row">
                    <span>Color</span>
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: '30px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className={`tab-btn ${textBold ? 'active' : ''}`} onClick={() => setTextBold(!textBold)} style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 'bold', flex: 1 }}>B</button>
                    <button className={`tab-btn ${textItalic ? 'active' : ''}`} onClick={() => setTextItalic(!textItalic)} style={{ padding: '6px 12px', fontSize: '14px', fontStyle: 'italic', flex: 1 }}>I</button>
                    <button className={`tab-btn ${textUnderline ? 'active' : ''}`} onClick={() => setTextUnderline(!textUnderline)} style={{ padding: '6px 12px', fontSize: '14px', textDecoration: 'underline', flex: 1 }}>U</button>
                  </div>
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '16px 0' }} />

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

            <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '16px 0' }} />

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

            <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '16px 0' }} />

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

        </section>
      )}

    </div>
  );
}
