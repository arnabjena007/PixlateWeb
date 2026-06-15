'use client';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PixlateContext = createContext();

export const usePixlate = () => useContext(PixlateContext);

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

export const PRESETS = [
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

export const DIMENSION_PRESETS = [
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

export const PixlateProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('Processed');
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
  const [randomSeed, setRandomSeed] = useState(0);
  const [variations, setVariations] = useState(1);

  // Text Overlay State
  const [textOverlay, setTextOverlay] = useState(false);
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

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
  const [halftone, setHalftone] = useState(false);
  const [halftoneSize, setHalftoneSize] = useState(4);

  // Intensity State
  const [coverage, setCoverage] = useState(85);
  const [edgeEmphasis, setEdgeEmphasis] = useState(60);
  const [density, setDensity] = useState(30);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(100);

  const handleReset = () => {
    setTextOverlay(false);
    setTextOverlays([]);
    setSelectedTextId(null);

    setImageOverlay(false);
    setImageOverlays([]);
    setSelectedOverlayId(null);

    setWhitePercent(0);
    setColorSort(false);
    setReverse(false);
    setRandomSeed(0);
    setVariations(1);

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
    setHalftone(false);
    setHalftoneSize(4);

    setCoverage(85);
    setEdgeEmphasis(60);
    setDensity(30);
    setBrightness(0);
    setContrast(100);
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
    formData.append('coverage', coverage);
    formData.append('edgeEmphasis', edgeEmphasis);
    formData.append('density', density);
    formData.append('brightness', brightness);
    formData.append('contrast', contrast);

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

      const drawTextOverlay = (isFront) => {
        if (!textOverlay) return;
        textOverlays.forEach(textObj => {
          if (textObj.front !== isFront) return;
          ctx.fillStyle = textObj.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let fontString = '';
          if (textObj.italic) fontString += 'italic ';
          if (textObj.bold) fontString += 'bold ';
          
          let numericSize = 70; // Medium
          if (textObj.size === 'Small') numericSize = 30;
          else if (textObj.size === 'Large') numericSize = 150;
          else if (textObj.size === 'Extra Large') numericSize = 300;
          
          fontString += `${numericSize}px "${textObj.font}", sans-serif`;
          ctx.font = fontString;
          
          const xPos = canvas.width * (textObj.x / 100);
          const yPos = canvas.height * (textObj.y / 100);
          ctx.fillText(textObj.value, xPos, yPos);
  
          if (textObj.underline) {
            const textMetrics = ctx.measureText(textObj.value);
            const textWidth = textMetrics.width;
            ctx.fillRect(xPos - textWidth / 2, yPos + numericSize / 2 - (numericSize * 0.1), textWidth, numericSize / 15);
          }
        });
      };

      drawTextOverlay(false); // Draw background texts

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
        
        drawTextOverlay(true); // Draw foreground texts
        
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

  const contextValue = {
    // State
    image, setImage,
    previewUrl, setPreviewUrl,
    outputUrl, setOutputUrl,
    outputBlob, setOutputBlob,
    loading, setLoading,
    dragActive, setDragActive,
    activeTab, setActiveTab,
    showEditor, setShowEditor,

    dimensionPreset, setDimensionPreset,
    width, setWidth,
    height, setHeight,
    sliderMaxWidth, setSliderMaxWidth,
    sliderMaxHeight, setSliderMaxHeight,
    whitePercent, setWhitePercent,
    colorSort, setColorSort,
    reverse, setReverse,
    randomSeed, setRandomSeed,
    variations, setVariations,

    textOverlay, setTextOverlay,
    textOverlays, setTextOverlays,
    selectedTextId, setSelectedTextId,

    imageOverlay, setImageOverlay,
    imageOverlays, setImageOverlays,
    selectedOverlayId, setSelectedOverlayId,

    colorOverlay, setColorOverlay,
    overlayColor, setOverlayColor,
    overlayOpacity, setOverlayOpacity,
    overlayBlend, setOverlayBlend,
    vignette, setVignette,
    vignetteStrength, setVignetteStrength,
    scanLines, setScanLines,
    scanLineStrength, setScanLineStrength,
    crt, setCrt,
    crtStrength, setCrtStrength,
    chromatic, setChromatic,
    chromaticStrength, setChromaticStrength,
    glitch, setGlitch,
    glitchStrength, setGlitchStrength,
    blur, setBlur,
    blurStrength, setBlurStrength,
    halftone, setHalftone,
    halftoneSize, setHalftoneSize,

    coverage, setCoverage,
    edgeEmphasis, setEdgeEmphasis,
    density, setDensity,
    brightness, setBrightness,
    contrast, setContrast,

    // Refs
    fileInputRef,
    overlayFileInputRef,

    // Handlers
    handleReset,
    handleOverlayFileChange,
    handleFile,
    handleFileChange,
    handleDrag,
    handleDrop,
    triggerFileInput,
    handleInspireMe,
    handleSelectPreset,
    handleProcess,
    handleDownload,
    scrollToEditor,
    scrollToHero,
  };

  return (
    <PixlateContext.Provider value={contextValue}>
      {children}
    </PixlateContext.Provider>
  );
};
