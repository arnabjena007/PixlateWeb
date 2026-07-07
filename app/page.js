'use client';
import { PixlateProvider, usePixlate } from '@/context/PixlateContext';
import HeroSection from '@/components/layout/HeroSection';
import { HeroScrollDemo } from '@/components/layout/HeroScrollDemo';
import { FeaturesSectionDemo } from '@/components/layout/FeaturesSection';

import WorkspaceSection from '@/components/layout/WorkspaceSection';
import SidebarSection from '@/components/layout/SidebarSection';
import Footer from '@/components/layout/Footer';
import FAQSection from '@/components/layout/FAQSection';


function PixlateAppContent() {
  const { showEditor, fileInputRef, overlayFileInputRef, handleFileChange, handleOverlayFileChange, chromaticStrength, glitchStrength } = usePixlate();

  return (
    <div className="app-container bg-[#09090b] text-white" suppressHydrationWarning>

      {/* SVG Filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id={`chromatic-${chromaticStrength}`}>
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feOffset in="red" dx={chromaticStrength * 2} dy="0" result="redOffset" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
          <feOffset in="green" dx="0" dy="0" result="greenOffset" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feOffset in="blue" dx={-chromaticStrength * 2} dy="0" result="blueOffset" />
          <feBlend mode="screen" in="redOffset" in2="greenOffset" result="rg" />
          <feBlend mode="screen" in="rg" in2="blueOffset" result="rgb" />
        </filter>
        <filter id={`glitch-${glitchStrength}`}>
          <feTurbulence type="fractalNoise" baseFrequency={`${glitchStrength / 100} 0`} numOctaves="1" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" in="noise" result="coloredNoise" />
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

      {!showEditor && (
        <>

          <HeroSection />
          <HeroScrollDemo />
          <FeaturesSectionDemo />
          <FAQSection />
          <Footer />
        </>
      )}

      {showEditor && (
        <section id="editor-section" className="editor-section">
          <WorkspaceSection />
          <SidebarSection />
        </section>
      )}

    </div>
  );
}


export default function PixlateApp() {
  return (
    <PixlateProvider>
      <PixlateAppContent />
    </PixlateProvider>
  );
}
