'use client';

import React from 'react';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: string;
    brand: string;
    brandLogo?: string;
    image: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="flex flex-col relative group cursor-pointer">
            {/* Brand Label (Floating Elegant) */}
            <div className="absolute top-4 left-4 z-10">
                <span className="text-[9px] font-bold uppercase text-[#1A1A1A] tracking-widest bg-white/80 backdrop-blur-sm px-2 py-1">
                    {product.brand}
                </span>
            </div>

            {/* Image Container - Luxury Boutique Style */}
            <div className="aspect-[3/4] bg-white relative overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all duration-500">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                />

                <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white text-[#1A1A1A] shadow-md z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1.5 text-center px-2">
                <h3 className="text-[11px] text-[#4A4A4A] font-medium tracking-wide uppercase line-clamp-1">{product.name}</h3>
                <span className="text-[13px] font-bold text-[#1A1A1A] tracking-tight">{product.price}</span>

                {/* Subtle Luxury AI Try-On Button */}
                <button
                    className="mt-4 w-full py-3 border border-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] relative overflow-hidden group/btn"
                >
                    <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Kiyib ko'rish ✨</span>
                    <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>
        </div>
    );
}
