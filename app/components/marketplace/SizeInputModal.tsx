"use client";

import { useState } from 'react';
import { calculateRecommendedSize, UserMeasurements } from '@/lib/sizeUtils';

interface SizeInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecommendation: (size: string, note: string) => void;
}

export default function SizeInputModal({ isOpen, onClose, onRecommendation }: SizeInputModalProps) {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const measurements: UserMeasurements = {
            height_cm: parseInt(height),
            weight_kg: parseInt(weight)
        };
        const result = calculateRecommendedSize(measurements);
        onRecommendation(result.size, result.note || "");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#0f172a] p-6 rounded-none border border-[#c5a059] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-[#c5a059]">Mening O'lchamim</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#c5a059] mb-2">Bo'y (sm)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#c5a059] outline-none transition-colors"
                            placeholder="Masalan: 180"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#c5a059] mb-2">Vazn (kg)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#c5a059] outline-none transition-colors"
                            placeholder="Masalan: 75"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 mt-4 bg-[#c5a059] text-[#0f172a] font-bold text-xs uppercase tracking-widest hover:bg-[#e0b860] transition-colors"
                    >
                        Aniqlash
                    </button>
                </form>
            </div>
        </div>
    );
}
