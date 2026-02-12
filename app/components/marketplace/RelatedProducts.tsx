"use client";

import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
}

// Mock Data for now
const MOCK_RELATED: Product[] = [
    {
        id: '101',
        name: 'Klassik charm poyabzal',
        price: '890,000 UZS',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: '102',
        name: 'Premium Charm Kamar',
        price: '250,000 UZS',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: '103',
        name: 'Aviator Quyosh Ko\'zoynagi',
        price: '180,000 UZS',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop'
    }
];

export default function RelatedProducts() {
    return (
        <div className="mt-8 w-full animate-in slide-in-from-bottom-5 duration-500 delay-300">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-px bg-zinc-200 flex-1 dark:bg-zinc-800"></div>
                <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Obrazni to'ldiring</h3>
                <div className="h-px bg-zinc-200 flex-1 dark:bg-zinc-800"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {MOCK_RELATED.map((product) => (
                    <Link href={`/marketplace/product/${product.id}`} key={product.id} className="group block">
                        <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-zinc-100 mb-2">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="text-[10px] font-bold line-clamp-1 mb-0.5">{product.name}</h4>
                        <p className="text-[10px] text-zinc-500">{product.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
