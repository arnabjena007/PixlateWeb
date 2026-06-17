"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Moves the header up as we scroll down, creating the "space out" effect
  const translate = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div
      className="container-scroll-root"
      ref={containerRef}
    >
      <div
        className="container-scroll-inner"
      >
        {titleComponent && <Header translate={translate} titleComponent={titleComponent} />}
        <Card>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="container-scroll-header"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({ children }) => {
  return (
    <div className="container-scroll-card">
      <div className="container-scroll-card-inner">
        {children}
      </div>
    </div>
  );
};
