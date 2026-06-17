"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { usePixlate } from '@/context/PixlateContext';
import './hero-scroll.css';

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold" style={{ color: 'white' }}>
              Transform your images with <br />
              <span className="font-bold mt-1 leading-none" style={{ fontSize: '6rem', lineHeight: '1', display: 'inline-block' }}>
                Pixel Sorting
              </span>
            </h1>
          </>
        }>
        <img
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false} />
      </ContainerScroll>
    </div>
  );
}
