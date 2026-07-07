'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'What is Pixlate?',
    a: 'Pixlate is a free, browser-based generative art engine. Upload any photo and Pixlate transforms it into organic, flowing color patterns using pixel-sorting and generative algorithms — no sign-up required.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes, completely. Pixlate has no subscription, no payments, and no hidden tiers. Everything runs in your browser and your images never leave your device.',
  },
  {
    q: 'Does Pixlate upload my images to a server?',
    a: 'No. All processing happens entirely in your browser using the Web Canvas API. Your images are never sent to any server or stored anywhere outside your local session.',
  },
  {
    q: 'What image formats can I export?',
    a: 'You can export your creations as PNG or JPEG at the full canvas resolution (default 1024 × 767). You can also copy an HTML embed snippet to drop the image directly into any webpage.',
  },
  {
    q: 'Can I add text or images on top of my canvas?',
    a: 'Yes. The workspace editor lets you place and resize text overlays and image overlays on the canvas. Their positions are preserved perfectly in the exported file.',
  },
  {
    q: 'What browsers are supported?',
    a: 'Pixlate works best in modern Chromium-based browsers (Chrome, Edge, Arc) and Firefox. Safari is supported but may have minor rendering differences with certain blend modes.',
  },
  {
    q: 'Can I suggest a feature or report a bug?',
    a: 'Absolutely! Head to the GitHub Issues page linked in the sidebar, or use the "What would you like to see in Pixlate?" feedback panel inside the app.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section style={{
      position: 'relative',
      backgroundColor: '#09090b',
      padding: '6rem 1.5rem',
    }}>
      {/* Subtle top separator line */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '80%', maxWidth: '900px',
        height: '1px',
        background: 'linear-gradient(to right, transparent, #262626, transparent)',
      }} />

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <p style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#a855f7',
            marginBottom: '12px',
          }}>FAQ</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            margin: 0,
          }}>Frequently Asked Questions</h2>
          <p style={{
            marginTop: '1rem',
            color: '#71717a',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}>
            Everything you need to know about Pixlate.
          </p>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  borderRadius: '12px',
                  border: `1px solid ${isOpen ? 'rgba(168,85,247,0.3)' : '#262626'}`,
                  background: isOpen
                    ? 'linear-gradient(135deg, rgba(168,85,247,0.04) 0%, rgba(9,9,11,1) 100%)'
                    : '#111113',
                  overflow: 'hidden',
                  transition: 'border-color 0.25s ease, background 0.25s ease',
                  cursor: 'pointer',
                }}
                onClick={() => toggle(i)}
              >
                {/* Question row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 22px',
                  gap: '16px',
                }}>
                  <span style={{
                    fontSize: '0.975rem',
                    fontWeight: 500,
                    color: isOpen ? '#e4e4e7' : '#a1a1aa',
                    transition: 'color 0.2s ease',
                    userSelect: 'none',
                  }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{
                      flexShrink: 0,
                      width: '22px', height: '22px',
                      borderRadius: '50%',
                      background: isOpen ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isOpen ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isOpen ? '#a855f7' : '#52525b',
                      fontSize: '16px',
                      lineHeight: 1,
                      fontWeight: 300,
                      transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease',
                    }}
                  >
                    +
                  </motion.span>
                </div>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        margin: 0,
                        padding: '0 22px 20px',
                        fontSize: '0.9rem',
                        color: '#71717a',
                        lineHeight: 1.7,
                      }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
