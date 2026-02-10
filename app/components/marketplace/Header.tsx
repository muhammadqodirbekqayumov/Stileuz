'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-black/50 backdrop-blur-md border-b border-white/10 py-4'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/marketplace" className="text-2xl font-bold tracking-tighter">
                    STILUZ <span className="text-indigo-500">MARKET</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    {['Discover', 'Collection', 'Designers', 'About'].map((item) => (
                        <Link
                            key={item}
                            href={`/marketplace/${item.toLowerCase()}`}
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <button className="p-2 text-white/70 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-transform transform hover:scale-105">
                        Sign In
                    </button>
                </div>
            </div>
        </header>
    );
}
