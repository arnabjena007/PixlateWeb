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

      {/* Soft neutral glow behind title */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.10) 0%, transparent 70%)',
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
            containerClassName="inline-flex w-fit items-center justify-center rounded-[9999px] mx-auto p-[7px]"
            containerStyle={{
              background:
                'linear-gradient(100deg, rgba(203,155,198,0.72) 0%, rgba(182,141,177,0.58) 18%, rgba(122,112,99,0.32) 48%, rgba(37,39,39,0.94) 76%, rgba(27,29,29,1) 100%)',
              boxShadow:
                '0 10px 24px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(255,255,255,0.07)',
            }}
            gradientColors={[
              "rgb(219, 166, 207)",
              "rgb(196, 173, 136)",
              "rgb(75, 82, 79)",
            ]}
            noiseIntensity={0.16}
            animating={false}
          >
            <button
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[9999px] border-0 text-white transition-all duration-100 active:scale-98"
              style={{
                minHeight: '28px',
                padding: '0 12px',
                background: 'linear-gradient(90deg, #111111 0%, #0d0d0d 58%, #131515 100%)',
                fontSize: '13px',
                lineHeight: '16px',
                fontWeight: 600,
                letterSpacing: '0',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.38)',
              }}
              onClick={scrollToEditor}
            >
              Start publishing &rarr;
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

    </section>
  );
}
