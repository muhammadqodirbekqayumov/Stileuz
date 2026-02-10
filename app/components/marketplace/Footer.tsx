import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-neutral-900 border-t border-white/5 py-12 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4">STILUZ</h3>
                        <p className="text-neutral-400 text-sm">
                            Redefining digital fashion with AI-powered realism and premium aesthetics.
                        </p>
                    </div>

                    {[
                        { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Designers', 'Sale'] },
                        { title: 'Support', links: ['FAQ', 'Shipping', 'Returns', 'Contact Us'] },
                        { title: 'Company', links: ['About', 'Careers', 'Press', 'Privacy Policy'] },
                    ].map((column) => (
                        <div key={column.title}>
                            <h4 className="font-semibold mb-4 text-white">{column.title}</h4>
                            <ul className="space-y-2">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-neutral-400 hover:text-indigo-400 text-sm transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                    <p className="text-neutral-500 text-xs">
                        © {new Date().getFullYear()} Stiluz Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {/* Social placeholders */}
                        <div className="w-5 h-5 bg-neutral-800 rounded-full" />
                        <div className="w-5 h-5 bg-neutral-800 rounded-full" />
                        <div className="w-5 h-5 bg-neutral-800 rounded-full" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
