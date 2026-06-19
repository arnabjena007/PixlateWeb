"use client";

import { motion } from "framer-motion";
import React from "react";

const MarqueeRow = ({ items, direction = 1, label }) => {
  return (
    <div className="relative flex overflow-hidden w-full whitespace-nowrap py-4 sm:py-8 group">
      {/* Label indicating Before or After */}
      <div className="absolute top-0 sm:top-2 left-4 sm:left-1/2 sm:-translate-x-1/2 z-20 bg-black/40 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 text-white/90 text-xs sm:text-sm tracking-widest uppercase font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </div>

      <motion.div
        className="flex gap-2 min-w-full pl-2"
        animate={{
          x: direction === 1 ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40,
        }}
      >
        {items.map((src, i) => (
          <ImageCard key={`1-${i}`} src={src} />
        ))}
      </motion.div>
      <motion.div
        className="flex gap-2 min-w-full pl-2"
        animate={{
          x: direction === 1 ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40,
        }}
      >
        {items.map((src, i) => (
          <ImageCard key={`2-${i}`} src={src} />
        ))}
      </motion.div>
    </div>
  );
};

const ImageCard = ({ src }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        rotate: 0, 
        zIndex: 50,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)"
      }}
      className="relative flex-shrink-0 w-80 h-80 sm:w-[45vw] sm:h-[45vw] md:w-[50vw] md:h-[50vw] rounded-[1rem] sm:rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-4 border-[#1a1a1a]"
      style={{
        rotate: "-4deg",
        transformOrigin: "center center"
      }}
    >
      <img src={src} alt="Preset example" className="w-full h-full object-cover" />
    </motion.div>
  );
};

export default function PresetMarquee({ beforeImages = [], afterImages = [] }) {
  if (!beforeImages.length || !afterImages.length) {
    return null;
  }

  return (
    <section className="w-full py-8 sm:py-12 bg-[#0a0a0a] overflow-hidden flex flex-col gap-2 sm:gap-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          See the Difference
        </h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          One-click transformations. Hover to inspect the details.
        </p>
      </div>

      <div className="relative flex flex-col">
        {/* Top Row - Before */}
        <MarqueeRow items={beforeImages} direction={1} label="Original Image" />

        {/* Bottom Row - After */}
        <MarqueeRow items={afterImages} direction={1} label="Preset Applied" />

        {/* Edge fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 sm:w-64 bg-gradient-to-r from-[#0a0a0a] to-transparent z-30" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 sm:w-64 bg-gradient-to-l from-[#0a0a0a] to-transparent z-30" />
      </div>
    </section>
  );
}
