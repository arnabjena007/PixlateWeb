'use client';
import { useState, useEffect } from 'react';

export default function FeatureModal({ isOpen, onClose }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'success', 'error'

  useEffect(() => {
    if (isOpen) {
      setText('');
      setStatus('idle');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        backgroundColor: '#1E1E1E',
        borderRadius: '12px',
        width: '440px',
        maxWidth: '90%',
        padding: '24px',
        border: '1px solid #27272a',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#064e3b', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Thanks for the suggestion!</h2>
            <p style={{ color: '#a1a1aa', margin: 0, fontSize: '14px' }}>We have saved your idea.</p>
          </div>
        ) : (
          <>
            <h2 style={{ 
              color: '#fff', 
              fontSize: '20px', 
              fontWeight: 'bold', 
              margin: '0 0 8px 0' 
            }}>Suggest a Feature</h2>
            
            <p style={{ 
              color: '#a1a1aa', 
              fontSize: '14px', 
              margin: '0 0 20px 0' 
            }}>What would you like to see in Pixlate?</p>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your idea..."
              style={{
                width: '100%',
                height: '120px',
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                padding: '12px',
                color: '#f4f4f5',
                fontSize: '14px',
                resize: 'none',
                fontFamily: 'inherit',
                outline: 'none',
                marginBottom: '8px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
            />
            
            {status === 'error' && (
              <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px 0' }}>Something went wrong. Please try again.</p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  backgroundColor: '#27272a',
                  color: '#e4e4e7',
                  border: '1px solid #3f3f46',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3f3f46')}
                onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#27272a')}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !text.trim()}
                style={{
                  flex: 1,
                  backgroundColor: '#e4e4e7',
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: (isSubmitting || !text.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isSubmitting || !text.trim()) ? 0.5 : 1,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => !(isSubmitting || !text.trim()) && (e.currentTarget.style.backgroundColor = '#fff')}
                onMouseOut={(e) => !(isSubmitting || !text.trim()) && (e.currentTarget.style.backgroundColor = '#e4e4e7')}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
