'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function DownloadPreviewModal({ isOpen, onClose, canvas }) {
  const [format, setFormat] = useState('png');
  const [dataUrl, setDataUrl] = useState(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const embedRef = useRef(null);

  useEffect(() => {
    if (isOpen && canvas) {
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
    } else {
      setDataUrl(null);
      setShowEmbed(false);
      setCopied(false);
    }
  }, [isOpen, canvas]);

  if (!isOpen) return null;

  const getFilename = () => {
    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    return `Pixlate_${ts}.${format}`;
  };

  const getEmbedCode = () => {
    if (!dataUrl) return '';
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    // Re-encode in the chosen format for the embed tag
    const src = format === 'jpg'
      ? canvas.toDataURL('image/jpeg', 0.92)
      : dataUrl;
    return `<img src="${src}" alt="Pixlate Design" style="max-width:100%;height:auto;" />`;
  };

  const handleCopyEmbed = () => {
    const code = getEmbedCode();
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleDownload = () => {
    if (!canvas) return;
    setIsDownloading(true);
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.92 : undefined;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFilename();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
      onClose();
    }, mimeType, quality);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'pm-fade 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', pointerEvents: 'none',
      }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            pointerEvents: 'auto',
            background: '#1e1e1e',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '24px',
            width: '700px',
            maxWidth: '95vw',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            animation: 'pm-up 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#f4f4f5', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                  Export Design
                </h2>
                <p style={{ margin: 0, color: '#71717a', fontSize: '12px', marginTop: '1px' }}>
                  Download or embed your Pixlate creation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid #27272a',
                borderRadius: '8px', color: '#71717a', cursor: 'pointer',
                padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f4f4f5'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#71717a'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Image Preview */}
          <div style={{
            minHeight: '240px',
            maxHeight: '45vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'repeating-conic-gradient(#141414 0% 25%, #0d0d0f 0% 50%) 0 0 / 18px 18px',
            borderRadius: '10px', overflow: 'hidden',
            border: '1px solid #27272a',
          }}>
            {dataUrl ? (
              <img src={dataUrl} alt="Export Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', color: '#a1a1aa', gap: '10px', flexDirection: 'column' }}>
                <div className="spinner" />
                <span style={{ fontSize: '13px' }}>Generating preview…</span>
              </div>
            )}
          </div>

          {/* Format selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#71717a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginRight: '4px' }}>Format</span>
            {['png', 'jpg'].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{
                  padding: '6px 18px', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: format === f ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'rgba(255,255,255,0.04)',
                  color: format === f ? '#fff' : '#71717a',
                  border: `1px solid ${format === f ? 'transparent' : '#3f3f46'}`,
                  transition: 'all 0.2s',
                  boxShadow: format === f ? '0 2px 8px rgba(168,85,247,0.35)' : 'none',
                }}
              >{f}</button>
            ))}
          </div>

          {/* Embed Code toggle row */}
          <div>
            <button
              id="embed-code-toggle"
              onClick={() => setShowEmbed(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                background: showEmbed ? 'rgba(168,85,247,0.07)' : '#27272a',
                border: `1px solid ${showEmbed ? 'rgba(168,85,247,0.35)' : '#3f3f46'}`,
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseOver={(e) => { if (!showEmbed) e.currentTarget.style.background = '#2f2f2f'; }}
              onMouseOut={(e) => { if (!showEmbed) e.currentTarget.style.background = '#27272a'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={showEmbed ? '#a855f7' : '#71717a'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transition: 'stroke 0.2s' }}
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>

              <span style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: showEmbed ? '#c084fc' : '#a1a1aa', transition: 'color 0.2s' }}>
                Embed Code
              </span>

              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={showEmbed ? '#a855f7' : '#52525b'}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transform: showEmbed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s, stroke 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Embed code panel */}
            {showEmbed && (
              <div style={{
                marginTop: '8px',
                background: '#141414',
                border: '1px solid #27272a',
                borderRadius: '8px',
                overflow: 'hidden',
                animation: 'pm-fade 0.18s ease',
              }}>
                {/* Code block header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 14px',
                  borderBottom: '1px solid #1e1e24',
                }}>
                  <span style={{ fontSize: '11px', color: '#52525b', fontFamily: 'monospace' }}>HTML</span>
                  <button
                    id="copy-embed-btn"
                    onClick={handleCopyEmbed}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '4px 12px', borderRadius: '6px', cursor: 'pointer',
                      background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(168,85,247,0.12)',
                      border: `1px solid ${copied ? 'rgba(34,197,94,0.35)' : 'rgba(168,85,247,0.3)'}`,
                      color: copied ? '#4ade80' : '#c084fc',
                      fontSize: '12px', fontWeight: '600',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* The actual embed code, truncated visually */}
                <div
                  ref={embedRef}
                  style={{
                    padding: '14px',
                    fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
                    fontSize: '11px',
                    color: '#a78bfa',
                    lineHeight: '1.7',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    maxHeight: '90px',
                    overflowY: 'hidden',
                    userSelect: 'all',
                    borderRadius: '0 0 10px 10px',
                  }}
                >
                  {/* Syntax-highlight the tag manually */}
                  <span style={{ color: '#7dd3fc' }}>&lt;img</span>
                  <span style={{ color: '#86efac' }}> src</span>
                  <span style={{ color: '#f4f4f5' }}>=</span>
                  <span style={{ color: '#fca5a5' }}>"</span>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                    {format === 'jpg'
                      ? 'data:image/jpeg;base64,… (embedded)'
                      : 'data:image/png;base64,… (embedded)'}
                  </span>
                  <span style={{ color: '#fca5a5' }}>"</span>
                  <span style={{ color: '#86efac' }}> alt</span>
                  <span style={{ color: '#f4f4f5' }}>=</span>
                  <span style={{ color: '#fca5a5' }}>"Pixlate Design"</span>
                  <span style={{ color: '#86efac' }}> style</span>
                  <span style={{ color: '#f4f4f5' }}>=</span>
                  <span style={{ color: '#fca5a5' }}>"max-width:100%;height:auto;"</span>
                  <span style={{ color: '#7dd3fc' }}> /&gt;</span>
                </div>


              </div>
            )}
          </div>

          {/* Filename + Download */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span style={{ color: '#3f3f46', fontSize: '11px', fontFamily: 'monospace' }}>{getFilename()}</span>
            </div>

            <button
              id="export-download-btn"
              onClick={handleDownload}
              disabled={isDownloading || !dataUrl}
              style={{
                padding: '12px 24px', fontSize: '14px', fontWeight: '700',
                height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderRadius: '10px', cursor: isDownloading || !dataUrl ? 'not-allowed' : 'pointer',
                background: isDownloading || !dataUrl ? '#27272a' : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                color: isDownloading || !dataUrl ? '#52525b' : '#fff',
                border: 'none',
                boxShadow: isDownloading || !dataUrl ? 'none' : '0 4px 20px rgba(168,85,247,0.38)',
                transition: 'all 0.22s',
              }}
              onMouseOver={(e) => { if (!isDownloading && dataUrl) { e.currentTarget.style.boxShadow = '0 8px 28px rgba(168,85,247,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = (!isDownloading && dataUrl) ? '0 4px 20px rgba(168,85,247,0.38)' : 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isDownloading ? (
                <>
                  <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#71717a', borderRightColor: '#71717a' }} />
                  Exporting…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pm-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pm-up { from { opacity: 0; transform: translateY(14px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>
  );
}
