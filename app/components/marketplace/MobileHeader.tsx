'use client';

import React from 'react';
import Link from 'next/link';

export default function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F0EFEA]">
      {/* Top Bar: Logo & Actions */}
      <div className="flex items-center justify-between px-4 h-16 relative">
        {/* Left: Hamburger */}
        <button className="p-2 -ml-2 text-[#1A1A1A]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        {/* Center: Logo */}
        <Link href="/marketplace" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="luxury-serif text-2xl font-medium tracking-[0.05em] text-[#1A1A1A] uppercase">STILUZ</span>
          <div className="h-[1px] w-6 bg-[#D4AF37] mt-[-2px]"></div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 text-[#1A1A1A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3" /></svg>
          </button>
          <button className="p-2 text-[#1A1A1A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
          </button>
        </div>
      </div>

      {/* Nav Tabs: Separate row to avoid overlaps */}
      <nav className="flex items-center justify-center border-t border-[#F0EFEA] bg-white">
        <button className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-[#1A1A1A] relative">
          ASOSIY
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"></div>
        </button>
        <button className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-[#A09E97]">
          BRENDLAR
        </button>
        <button className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-[#A09E97]">
          KATALOG
        </button>
      </nav>
    </header>
  );
}
