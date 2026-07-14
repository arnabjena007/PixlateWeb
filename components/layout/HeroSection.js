'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { usePixlate } from '@/context/PixlateContext';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { NoiseBackground } from "@/components/ui/noise-background";

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
        <motion.div variants={itemVariants} className="flex justify-center mb-4">
          <NoiseBackground
            containerClassName="w-fit p-1 rounded-full mx-auto"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <button
              className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-1.5 text-xs font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
              onClick={scrollToEditor}
            >
              Generative Art Project &rarr;
            </button>
          </NoiseBackground>
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
