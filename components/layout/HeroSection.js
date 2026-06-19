'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { usePixlate } from '@/context/PixlateContext';

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

        <motion.div variants={itemVariants} className="hero-buttons">
          <button
            type="button"
            className="btn-primary"
            onClick={scrollToEditor}
            style={{ width: 'auto', padding: '14px 36px', fontSize: '14px' }}
          >
            Try it yourself
          </button>
          <Link
            href="/about"
            className="btn-secondary"
            style={{ width: 'auto', padding: '14px 36px', fontSize: '14px', display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
          >
            About the Project
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
