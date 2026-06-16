"use client";
import React, { useState, useRef, useEffect } from "react";

export const Compare = ({
  firstImage,
  secondImage,
  className,
  firstImageClassName,
  secondImageClassname,
  slideMode = "hover",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = clientX - left;
    const newPosition = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(newPosition);
  };

  const onMouseMove = (e) => {
    if (slideMode === "hover" || isDragging) {
      handleMove(e.clientX);
    }
  };

  const onTouchMove = (e) => {
    if (slideMode === "hover" || isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const onMouseDown = () => {
    if (slideMode === "drag") setIsDragging(true);
  };

  const onMouseUp = () => {
    if (slideMode === "drag") setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [slideMode]);

  return (
    <div
      ref={containerRef}
      className={`compare-container ${className || ""}`}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
      style={{
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        cursor: slideMode === "drag" ? (isDragging ? "grabbing" : "grab") : "ew-resize",
      }}
    >
      {/* Second Image (Base/Bottom) */}
      <img
        src={secondImage}
        alt="Second"
        className={`compare-img ${secondImageClassname || ""}`}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
        draggable={false}
      />

      {/* First Image (Top/Overlay, Clipped) */}
      <img
        src={firstImage}
        alt="First"
        className={`compare-img ${firstImageClassName || ""}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          pointerEvents: "none",
        }}
        draggable={false}
      />

      {/* Slider Line */}
      <div
        className="compare-slider-line"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: "2px",
          backgroundColor: "white",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="compare-slider-handle"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
