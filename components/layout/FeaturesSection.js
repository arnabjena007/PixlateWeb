"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Real-time Parameter Tweaking",
      description:
        "Adjust glitch intensity and chromatic aberration in real-time. See your pixel sorted artwork transform instantly.",
      skeleton: <SkeletonOne />,
      style: {
        gridColumn: 'span 4',
        borderBottom: '1px solid #262626',
        borderRight: '1px solid #262626',
      },
      mobileStyle: {},
    },
    {
      title: "Stunning Generative Output",
      description:
        "Generate endless unique variations of organic, captivating patterns from your photos.",
      skeleton: <SkeletonTwo />,
      style: {
        gridColumn: 'span 2',
        borderBottom: '1px solid #262626',
      },
      mobileStyle: {},
    },
    {
      title: "Watch our demo to get started",
      description:
        "Check out our quick start guide to see how easily you can create stunning generative art with Pixlate.",
      skeleton: <SkeletonThree />,
      style: {
        gridColumn: 'span 3',
        borderRight: '1px solid #262626',
      },
      mobileStyle: {},
    },
    {
      title: "Unleash Pixlate on the web",
      description:
        "Export and deploy your pixel-sorted masterpieces anywhere on the web, lightning fast.",
      skeleton: <SkeletonFour />,
      style: {
        gridColumn: 'span 3',
      },
      mobileStyle: {},
    },
  ];

  return (
    <div style={{
      position: 'relative',
      zIndex: 20,
      maxWidth: '80rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: '2.5rem',
      paddingBottom: '2.5rem',
    }}>
      <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <h4 style={{
          maxWidth: '64rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 500,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          color: 'white',
        }}>
          Packed with powerful features
        </h4>
        <p style={{
          maxWidth: '42rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.95rem',
          fontWeight: 400,
          color: '#a3a3a3',
        }}>
          From powerful real-time rendering to flexible export options, Pixlate gives you the ultimate control over your generative art.
        </p>
      </div>
      <div style={{ position: 'relative' }}>
        <div className="features-grid" style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          borderRadius: '0.375rem',
          border: '1px solid #262626',
        }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem',
                ...feature.style,
              }}
            >
              <p style={{
                maxWidth: '64rem',
                textAlign: 'left',
                fontSize: '1.25rem',
                letterSpacing: '-0.01em',
                color: 'white',
                fontWeight: 500,
              }}>
                {feature.title}
              </p>
              <p style={{
                maxWidth: '24rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: 400,
                color: '#a3a3a3',
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
              }}>
                {feature.description}
              </p>
              <div style={{ height: '100%', width: '100%' }}>{feature.skeleton}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SkeletonOne = () => {
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%', gap: '2.5rem', padding: '0.5rem 0.5rem 0.5rem 0.5rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '100%',
        width: '100%',
        backgroundColor: '#171717',
        padding: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        borderRadius: '0.5rem',
      }}>
        <div style={{ display: 'flex', height: '100%', width: '100%', flex: 1, flexDirection: 'column', gap: '0.5rem' }}>
          <img
            src="/linear.webp"
            alt="header"
            width={800}
            height={800}
            style={{ aspectRatio: '1', height: '100%', width: '100%', borderRadius: '0.125rem', objectFit: 'cover', objectPosition: 'left top' }}
          />
        </div>
      </div>
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: '15rem',
        width: '100%',
        background: 'linear-gradient(to top, #000, #000 30%, transparent)',
      }} />
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: '15rem',
        width: '100%',
        background: 'linear-gradient(to bottom, #000, transparent)',
      }} />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <a
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="_blank"
      rel="noopener noreferrer"
      style={{ position: 'relative', display: 'flex', height: '100%', gap: '2.5rem', textDecoration: 'none' }}
    >
      <div style={{ marginLeft: 'auto', marginRight: 'auto', height: '100%', width: '100%' }}>
        <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flex: 1, flexDirection: 'column', gap: '0.5rem' }}>
          <IconBrandYoutubeFilled
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              margin: 'auto',
              height: '5rem',
              width: '5rem',
              color: '#ef4444',
            }}
          />
          <img
            src="https://assets.aceternity.com/fireship.jpg"
            alt="header"
            width={800}
            height={800}
            style={{
              aspectRatio: '1',
              height: '100%',
              width: '100%',
              borderRadius: '0.125rem',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'filter 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.filter = 'blur(8px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; }}
          />
        </div>
      </div>
    </a>
  );
};

export const SkeletonTwo = () => {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop",
  ];

  // Fixed rotations to avoid hydration mismatch
  const rotations1 = [-5, 8, -3, 6, -7];
  const rotations2 = [4, -6, 9, -4, 7];

  const imageVariants = {
    whileHover: { scale: 1.1, rotate: 0, zIndex: 100 },
    whileTap: { scale: 1.1, rotate: 0, zIndex: 100 },
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      overflow: 'hidden',
      padding: '1rem 0',
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{ rotate: rotations1[idx] }}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <div style={{
              marginTop: '0.5rem',
              marginRight: '-0.5rem',
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: '0.75rem',
              border: '1px solid #404040',
              backgroundColor: '#262626',
              padding: '0.25rem',
            }}>
              <img
                src={image}
                alt="gallery"
                width="500"
                height="500"
                style={{ height: '6rem', width: '6rem', flexShrink: 0, borderRadius: '0.5rem', objectFit: 'cover' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{ rotate: rotations2[idx] }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <div style={{
              marginTop: '0.5rem',
              marginRight: '-0.5rem',
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: '0.75rem',
              border: '1px solid #404040',
              backgroundColor: '#262626',
              padding: '0.25rem',
            }}>
              <img
                src={image}
                alt="gallery"
                width="500"
                height="500"
                style={{ height: '6rem', width: '6rem', flexShrink: 0, borderRadius: '0.5rem', objectFit: 'cover' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      {/* Left/right fade gradients */}
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        height: '100%',
        width: '3rem',
        background: 'linear-gradient(to right, #09090b, transparent)',
      }} />
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
        height: '100%',
        width: '3rem',
        background: 'linear-gradient(to left, #09090b, transparent)',
      }} />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <Globe style={{ position: 'absolute', right: '-12rem', bottom: '-12rem', pointerEvents: 'none' }} size={600} />
  );
};

export const Globe = ({ style, size = 300 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvas from previous mount
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    Object.assign(canvas.style, {
      width: `${size}px`,
      height: `${size}px`,
      maxWidth: '100%',
      aspectRatio: '1',
    });
    containerRef.current.appendChild(canvas);

    let phi = 0;
    let rafId;
    let destroyed = false;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1.2, 1.2, 1.2],
      markers: [],
      onRender: () => {},
    });

    // Manual animation loop for guaranteed spinning
    function animate() {
      if (destroyed) return;
      phi += 0.01;
      globe.update({ phi });
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      globe.destroy();
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ ...style }} />
  );
};
