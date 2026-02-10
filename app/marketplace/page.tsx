'use client';

import React from 'react';
import MobileHeader from '../components/marketplace/MobileHeader';
import ProductCard from '../components/marketplace/ProductCard';
import Image from 'next/image';
import Link from 'next/link';

export default function MarketplacePage() {
    const products = [
        {
            id: '1',
            name: 'Slim Fit klassik qora kostyum-shim',
            price: '1,250,000 UZS',
            brand: 'Terra Pro',
            image: 'https://images.unsplash.com/photo-1594932224016-941ce0c7f28e?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: '2',
            name: 'Premium paxtali Polo futbolka - To\'q ko\'k',
            price: '320,000 UZS',
            brand: 'Selfie',
            image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: '3',
            name: 'Oq rangli Urban Sport Xudi',
            price: '450,000 UZS',
            brand: 'Just',
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: '4',
            name: 'Klassik charm poyabzal - Jigarrang',
            price: '890,000 UZS',
            brand: 'Europa',
            image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop'
        }
    ];

    return (
        <div className="bg-[#F9F8F6] min-h-screen text-[#1A1A1A] pt-[112px]"> {/* Adjusted pt to clear fixed header + tabs */}
            <MobileHeader />

            {/* Luxury Hero Section */}
            <section className="px-5 py-8 flex flex-col items-center">
                <div className="text-center mb-8 w-full">
                    <span className="text-[9px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase mb-3 block">Boshlash</span>
                    <h1 className="luxury-serif text-[32px] leading-[1.2] font-medium tracking-tight mb-4 px-4 text-balance">
                        Bichim va Sifatning Mutloq Uyg'unligi
                    </h1>
                    <div className="w-8 h-[1px] bg-[#D4AF37] mx-auto opacity-40"></div>
                </div>

                <div className="relative w-full aspect-[4/5] shadow-xl overflow-hidden mb-8 rounded-sm">
                    <Image
                        src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop"
                        alt="Luxury Fashion"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                </div>

                <Link href="/catalog" className="inline-block px-8 py-3.5 border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300">
                    Kollektsiyani ko'ring
                </Link>
            </section>

            {/* Main Feed */}
            <section className="px-5 py-12">
                <div className="flex flex-col items-center mb-10">
                    <h3 className="luxury-serif text-xl tracking-wide uppercase italic">Trendlar</h3>
                    <div className="w-6 h-[1px] bg-[#D4AF37] mt-2"></div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-12">
                    {products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>

            {/* AI Section with better spacing */}
            <section className="px-5 py-16 bg-white border-y border-[#F0EFEA]">
                <div className="flex flex-col items-center text-center">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-4">AI Boutique</span>
                    <h3 className="luxury-serif text-2xl font-medium mb-4">Virtual Kiyib Ko'rish</h3>
                    <p className="text-[12px] text-[#706F6A] mb-8 leading-relaxed max-w-[240px]">
                        O'zingizni butikda turgandek his qiling. Kiyimlarni AI yordamida rasmda sinab ko'ring.
                    </p>
                    <Link href="/try-on" className="bg-[#1A1A1A] text-white px-10 py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-300">
                        Foto yuklash ✨
                    </Link>
                </div>
            </section>

            <div className="py-10 text-center text-[9px] font-bold tracking-[0.4em] text-[#A09E97] uppercase">
                STILUZ • 2026
            </div>
        </div>
    );
}
