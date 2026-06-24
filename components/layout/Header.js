import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#000000]/60 backdrop-blur-md border-b border-white/5 shadow-sm shadow-black/20' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full h-[60px] flex items-center justify-center">
        <Link href="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95">
          <span className="font-bold text-[22px] tracking-tight text-white font-[family-name:var(--font-instrument-sans)]">
            Pixlate
          </span>
        </Link>
      </div>
    </header>
  );
}
