"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { usePixlate } from '@/context/PixlateContext';
import './hero-scroll.css';

export function HeroScrollDemo() {
  const { scrollToEditor } = usePixlate();

  return (
    <div className="hero-scroll-wrapper">
      <ContainerScroll>
        <img
          src="/hero-screenshot.png"
          alt="hero"
          className="hero-scroll-image"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
