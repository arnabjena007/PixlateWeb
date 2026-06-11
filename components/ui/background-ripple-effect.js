"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export const BackgroundRippleEffect = () => {
  const [clickedCell, setClickedCell] = useState(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cellSize = 36;
  // Calculate cols and rows to cover the full window, plus a safety margin
  const cols = useMemo(() => Math.ceil(dimensions.width / cellSize) + 2, [dimensions.width, cellSize]);
  const rows = useMemo(() => Math.ceil(dimensions.height / cellSize) + 2, [dimensions.height, cellSize]);

  return (
    <div
      ref={ref}
      className={cn(
        "ripple-grid-container",
        "[--cell-border-color:rgba(255,255,255,0.06)] [--cell-fill-color:transparent] [--cell-shadow-color:rgba(255,255,255,0.005)]"
      )}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}
    >
      <div className="relative h-full w-full overflow-hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
        <DivGrid
          key={`base-${rippleKey}`}
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

const DivGrid = ({
  className,
  rows = 30,
  cols = 55,
  cellSize = 36,
  borderColor = "#3f3f46",
  fillColor = "rgba(14,165,233,0.3)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-[3]", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        // Make the ripple propagate with a clean, natural delay and a constant duration
        const delay = clickedCell ? Math.max(0, distance * 30) : 0; // ms
        const duration = 600; // ms - constant duration for smooth fade out

        const style = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-80",
              clickedCell && "animate-cell-ripple",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
