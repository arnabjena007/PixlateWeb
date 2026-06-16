"use client";
import React from "react";
import { motion } from "framer-motion";
import { Compare } from "../ui/compare";
import './compare-section.css';

export function CompareSection() {
  return (
    <section className="compare-section">
      <div className="compare-content-wrapper">
        <motion.div 
          className="compare-text-container"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="compare-title">
            Transform Realism into Abstract Art
          </h2>
          <p className="compare-description">
            Experience the power of generative pixelation. Watch as ordinary photographs and landscapes are deconstructed into beautiful, organic, and abstract patterns. 
          </p>
          <p className="compare-description">
            Use the slider to see the dramatic difference between the original scene and the pixelated masterpiece.
          </p>
        </motion.div>
        
        <motion.div 
          className="compare-demo-wrapper"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Compare
            firstImage="/compare-original.jpg"
            secondImage="/compare-pixelated.jpg"
            className="compare-demo-instance"
            slideMode="hover"
          />
        </motion.div>
      </div>
    </section>
  );
}
