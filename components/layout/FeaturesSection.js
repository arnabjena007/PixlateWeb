"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Compare } from "../ui/compare";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Real-time Parameter Tweaking",
      description:
        "Adjust glitch intensity and chromatic aberration in real-time. See your pixel sorted artwork transform instantly.",
      skeleton: <SkeletonOne />,
      style: {
        gridColumn: 'span 3',
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
    <div style={{ position: 'relative', display: 'flex', height: '100%', paddingTop: '2rem', paddingBottom: '2rem', paddingLeft: '0.5rem', paddingRight: '0', marginRight: '-2rem' }}>
      <div style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#171717',
        borderTop: '1px solid #404040',
        borderLeft: '1px solid #404040',
        borderBottom: '1px solid #404040',
        borderRight: 'none',
        borderTopLeftRadius: '0.5rem',
        borderBottomLeftRadius: '0.5rem',
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', height: '100%', width: '100%', flex: 1, flexDirection: 'column', position: 'relative', zIndex: 50 }}>
          <Compare
            firstImage="/compare-original.jpg"
            secondImage="/compare-pixelated.jpg"
            className="h-full w-full object-cover object-left-top"
            slideMode="hover"
          />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTwo = () => {
  const images = [
      "/feature1.png",
      "/feature2.png",
      "/feature3.png",
      "/feature4.png",
      "/feature5.png",
      ];

      // Fixed rotations to avoid hydration mismatch
      const rotations1 = [-5, 8, -3, 6, -7];
      const rotations2 = [4, -6, 9, -4, 7];

      const imageVariants = {
        whileHover: {scale: 1.1, rotate: 0, zIndex: 100 },
      whileTap: {scale: 1.1, rotate: 0, zIndex: 100 },
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
        <motion.div 
          style={{ display: 'flex', flexDirection: 'row', width: 'max-content' }}
          animate={{ x: ["0%", "-25%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...images, ...images, ...images, ...images].map((image, idx) => (
            <motion.div
              variants={imageVariants}
              key={"images-first" + idx}
              style={{ rotate: rotations1[idx % rotations1.length] }}
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
                  style={{ height: '10rem', width: '10rem', flexShrink: 0, borderRadius: '0.5rem', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          style={{ display: 'flex', flexDirection: 'row', width: 'max-content' }}
          animate={{ x: ["-25%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...images, ...images, ...images, ...images].map((image, idx) => (
            <motion.div
              key={"images-second" + idx}
              style={{ rotate: rotations2[idx % rotations2.length] }}
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
                  style={{ height: '10rem', width: '10rem', flexShrink: 0, borderRadius: '0.5rem', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
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
