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

      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >


        <motion.h1 variants={itemVariants} className="hero-title">Pixlate</motion.h1>

        <motion.p variants={itemVariants} className="hero-subtitle">
          Create stunning, organic generative art. Export and integrate seamlessly into your projects.
        </motion.p>

        <motion.div variants={itemVariants} className="hero-buttons flex items-center justify-center gap-6 mt-8">
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

