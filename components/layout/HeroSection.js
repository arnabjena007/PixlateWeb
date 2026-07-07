'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { usePixlate } from '@/context/PixlateContext';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function HeroSection() {
  const { scrollToEditor } = usePixlate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="hero-section" className="hero-section">
      <BackgroundRippleEffect />

      {/* Purple ambient glow behind title */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 2,
        filter: 'blur(40px)',
      }} />

      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '900px' }}
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="hero-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#c084fc',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: '#a855f7',
              boxShadow: '0 0 8px #a855f7',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            Generative Art Engine
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="hero-title">Pixlate</motion.h1>

        <motion.p variants={itemVariants} className="hero-subtitle">
          Create stunning, organic generative art. Export and integrate seamlessly into your projects.
        </motion.p>

        <motion.div variants={itemVariants} className="hero-buttons flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
          <HoverBorderGradient
            containerClassName="rounded-xl h-[52px] min-w-[180px] border border-white/20"
            as="button"
            className="text-white flex items-center justify-center h-full w-full px-8 text-[15px] font-medium relative overflow-hidden"
            onClick={scrollToEditor}
          >
            <span className="relative z-10">Try it yourself</span>
            <div className="shiny-sweep z-0" />
          </HoverBorderGradient>

          <Link
            href="/about"
            className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center h-[52px] min-w-[180px] rounded-xl px-8 text-[15px] font-medium"
          >
            About the Project
          </Link>
        </motion.div>

      </motion.div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #a855f7; }
          50% { opacity: 0.5; box-shadow: 0 0 12px #a855f7; }
        }
      `}</style>
    </section>
  );
}
