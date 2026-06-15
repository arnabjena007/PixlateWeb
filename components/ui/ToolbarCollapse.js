'use client';
import { useState } from 'react';

export default function ToolbarCollapse({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="section toolbar-collapse">
      <div 
        className="section-title collapse-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          cursor: 'pointer', 
          alignItems: 'center'
        }}
      >
        <span>{title}</span>
        <svg 
          width="14" height="14" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <div className="collapse-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
