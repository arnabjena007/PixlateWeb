import React from 'react';



export function PeerlistBadge({ version = "1.0.0", link = "#" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Top Badge: Launched on Peerlist */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <img 
          src="/peerlist.svg" 
          alt="Launched on Peerlist spotlight" 
          width="250" 
          height="54" 
          className="mb-4"
          style={{ width: '250px', height: '54px' }}
        />
      </a>

      {/* Bottom Pill: Just launched: vX.X is here */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#00c950]/20 bg-[#001f0f] text-[#00e572] text-[15px] font-medium shadow-[0_4px_14px_rgba(0,201,80,0.05)] transition-all hover:bg-[#002a15] hover:border-[#00c950]/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] text-[#00e572]"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span className="text-[14px]">🎉</span>
        <span className="tracking-tight">Just launched: v{version} is here</span>
      </div>
    </div>
  );
}
