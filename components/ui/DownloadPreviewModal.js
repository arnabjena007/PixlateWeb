'use client';
import React, { useState, useEffect } from 'react';

export default function DownloadPreviewModal({ isOpen, onClose, canvas }) {
  const [format, setFormat] = useState('png');
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (isOpen && canvas) {
      // Generate a data URL for the preview image
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
    } else {
      setDataUrl(null);
    }
  }, [isOpen, canvas]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvas) return;
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.92 : undefined;
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `custom-pixlate.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onClose(); // Close modal after initiating download
    }, mimeType, quality);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#18181b', border: '1px solid #27272a',
        borderRadius: '12px', padding: '24px', maxWidth: '90vw', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', gap: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '700px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#f4f4f5', fontSize: '20px', fontWeight: 'bold' }}>Download Preview</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={{
          flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#09090b', borderRadius: '8px', overflow: 'hidden', padding: '16px'
        }}>
          {dataUrl ? (
            <img src={dataUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid #27272a' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', color: '#a1a1aa', gap: '8px' }}>
              <div className="spinner"></div> Generating preview...
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#a1a1aa', fontSize: '14px', marginRight: '8px' }}>Format:</span>
            <button
              onClick={() => setFormat('png')}
              style={{
                padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                background: format === 'png' ? '#a855f7' : 'transparent',
                color: format === 'png' ? '#fff' : '#a1a1aa',
                border: `1px solid ${format === 'png' ? '#a855f7' : '#3f3f46'}`,
                transition: 'all 0.2s'
              }}
            >
              PNG
            </button>
            <button
              onClick={() => setFormat('jpg')}
              style={{
                padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                background: format === 'jpg' ? '#a855f7' : 'transparent',
                color: format === 'jpg' ? '#fff' : '#a1a1aa',
                border: `1px solid ${format === 'jpg' ? '#a855f7' : '#3f3f46'}`,
                transition: 'all 0.2s'
              }}
            >
              JPG
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="btn-primary"
            style={{ padding: '8px 24px', fontSize: '14px', height: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Confirm Download
          </button>
        </div>
      </div>
    </div>
  );
}
