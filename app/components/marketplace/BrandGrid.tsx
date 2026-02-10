import React from 'react';

// Sample Brand Logos (Using text placeholders for now, but styled as logos)
const brands = [
    { name: 'Terra Pro', color: 'bg-orange-600' },
    { name: 'Selfie', color: 'bg-pink-600' },
    { name: 'Just', color: 'bg-blue-600' },
    { name: 'Europa', color: 'bg-green-600' },
    { name: 'Avva', color: 'bg-red-600' },
    { name: 'Buka', color: 'bg-indigo-600' },
];

export default function BrandGrid() {
    return (
        <section className="py-8 bg-white border-b border-gray-50">
            <div className="px-5 mb-5 flex items-center justify-between">
                <h3 className="font-extrabold text-xl tracking-tight text-black">Featured Brands</h3>
                <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">View All</button>
            </div>

            <div className="flex gap-5 overflow-x-auto px-5 pb-4 no-scrollbar scroll-smooth">
                {brands.map((brand) => (
                    <div key={brand.name} className="flex flex-col items-center gap-3 flex-shrink-0">
                        <div className={`w-20 h-20 rounded-full border border-gray-100 bg-white flex items-center justify-center text-black font-black text-[10px] text-center shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer`}>
                            {/* Placeholders for real logos */}
                            <div className="p-2">{brand.name.toUpperCase()}</div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 text-center truncate w-20 uppercase tracking-tighter">{brand.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
