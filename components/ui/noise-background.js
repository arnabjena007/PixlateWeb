'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  containerStyle,
  gradientColors = ['rgb(255, 255, 255)', 'rgb(210, 210, 210)', 'rgb(170, 170, 170)'],
  noiseIntensity = 0.12,
  speed = 1,
  animating = true,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden transition-all duration-300',
        containerClassName,
      )}
      style={containerStyle}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen filter blur-[40px]"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${gradientColors[0]} 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, ${gradientColors[1]} 0%, transparent 50%),
                         radial-gradient(circle at 50% 50%, ${gradientColors[2]} 0%, transparent 60%)`,
            animation: animating ? `gradient-drift ${30 / speed}s ease-in-out infinite alternate` : 'none',
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10 select-none"
        style={{
          opacity: noiseIntensity,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      <div className={cn('relative z-20', className)}>{children}</div>

      <style jsx global>{`
        @keyframes gradient-drift {
          0% {
            transform: scale(1) translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: scale(1.1) translate(10px, -15px) rotate(5deg);
          }
          66% {
            transform: scale(0.95) translate(-15px, 10px) rotate(-5deg);
          }
          100% {
            transform: scale(1.05) translate(5px, 5px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
};

export default NoiseBackground;
