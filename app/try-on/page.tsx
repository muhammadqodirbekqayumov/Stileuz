"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import styles from "./page.module.css";
import { getBrand, BrandConfig } from "../../lib/brands";
import {
    Sparkles,
    Download,
    Share2,
    RefreshCw,
    ShoppingBag,
    Ruler,
    Instagram,
    Send,
    Phone
} from "lucide-react";
import SizeInputModal from "../components/marketplace/SizeInputModal";
import RelatedProducts from "../components/marketplace/RelatedProducts";
import ShareButton from "../components/marketplace/ShareButton";
import { resizeImage } from "../../lib/imageUtils";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

import BrandIntroModal from "../components/BrandIntroModal";

function TryOnContent() {
    const searchParams = useSearchParams();
    const brandParam = searchParams.get("brand");
    const garmentParam = searchParams.get("garment_url");

    const [brand, setBrand] = useState<BrandConfig>(getBrand(brandParam));
    const [personImage, setPersonImage] = useState<File | string | null>(null);
    const [garmentImage, setGarmentImage] = useState<File | string | null>(garmentParam);
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Status State
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Brand Intro state (handled by modal)

    // Config State
    const [category, setCategory] = useState("upper_body");
    const [useHQ, setUseHQ] = useState(true);

    // Smart Features State
    const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
    const [recommendedSize, setRecommendedSize] = useState<{ size: string, note: string } | null>(null);

    const getSafeUrl = (imgData: any): string => {
        if (!imgData) return "";
        if (typeof imgData === 'string') return imgData;
        if (Array.isArray(imgData) && imgData.length > 0) return getSafeUrl(imgData[0]);
        if (typeof imgData === 'object') return imgData.url || imgData.uri || imgData.output || "";
        return "";
    }

    const handleFileSelect = async (file: File, type: 'human' | 'garment') => {
        try {
            // Client-side Resize to max 1500px to prevent payload errors
            // Also converts potential HEIC/etc to standard JPEG blob via canvas if supported,
            // but usually browser handles basic formats. 
            // We use a safe resized file.
            const resizedFile = await resizeImage(file, 1280);

            if (type === 'human') setPersonImage(resizedFile);
            else setGarmentImage(resizedFile);

        } catch (err) {
            console.error("Resize error:", err);
            // Fallback to original if resize fails
            if (type === 'human') setPersonImage(file);
            else setGarmentImage(file);
        }
    };

    const handleGenerate = async () => {
        if (!personImage || !garmentImage) {
            setError("Please upload both your photo and a garment photo.");
            return;
        }

        setLoading(true);
        setError(null);
        setResultImage(null);

        try {
            setStatusText("starting");

            const formData = new FormData();
            formData.append("type", "vton");

            if (typeof personImage === 'string') formData.append("human_image_url", personImage);
            else formData.append("human_image", personImage);

            if (typeof garmentImage === 'string') formData.append("garm_img_url", garmentImage);
            else formData.append("garm_img", garmentImage);

            formData.append("category", category);
            if (useHQ) formData.append("description", "high quality, detailed texture, photorealistic");

            const vtonRes = await fetch("/api/predictions", { method: "POST", body: formData });
            const vtonData = await vtonRes.json();
            if (vtonData.error) throw new Error(vtonData.error);

            let vtonId = vtonData.id;
            let vtonResult = null;

            setStatusText("processing");

            while (!vtonResult) {
                await sleep(3000);
                const statusRes = await fetch(`/api/predictions/${vtonId}`);
                const statusData = await statusRes.json();

                if (statusData.status === "succeeded") {
                    vtonResult = getSafeUrl(statusData.output);
                } else if (statusData.status === "failed" || statusData.status === "canceled") {
                    throw new Error("Virtual Try-On Failed. Please try again with a clearer photo.");
                }
            }

            // Upscale logic (optional, keeping it simple for now or integrated in VTON if steps are high)
            // For now, using the VTON result directly as IDM-VTON is quite good.
            setResultImage(vtonResult);
            setStatusText("completed");

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (!resultImage) return;
        const link = document.createElement("a");
        link.href = resultImage;
        link.download = "adamari-fit.png";
        link.click();
    };

    return (
        <div className={styles.container}>
            <BrandIntroModal />

            {/* Minimalist Top Bar */}
            <div className="flex justify-center mb-8">
                <h1 className="text-2xl font-serif text-[#c5a059] tracking-[0.2em] uppercase border-b border-[#c5a059]/30 pb-2">Adamari Fitting Room</h1>
            </div>

            <div className={styles.grid}>
                {/* LEFT PANEL - CONTROLS */}
                <div className={styles.panel}>
                    <div className={styles.stepTitle}>01. Upload Your Photo</div>

                    <div className={styles.uploadArea}>
                        {/* Human Image Upload */}
                        <div className={styles.inputGroup}>
                            <label className="text-xs uppercase tracking-widest text-[#c5a059] mb-3">Your Photo</label>
                            <FileUpload
                                onFileSelect={(file) => handleFileSelect(file, 'human')}
                                label="Rasmingizni yuklang"
                                sublabel="To'liq bo'y yoki yuqori qism"
                            />
                            {!personImage && (
                                <p className="text-[10px] text-white/30 mt-2 italic">
                                    *Full body or upper body photo with good lighting.
                                </p>
                            )}
                        </div>

                        {/* Garment Image Upload */}
                        <div className={styles.inputGroup}>
                            <label className="text-xs uppercase tracking-widest text-[#c5a059] mb-3">Garment Photo</label>
                            <FileUpload
                                onFileSelect={(file) => handleFileSelect(file, 'garment')}
                                label="Kiyim rasmini yuklang"
                                sublabel="T-shirt, ko'ylak, kurtka va h.k."
                            />
                        </div>

                        {/* Category Selection */}
                        <div className={styles.inputGroup}>
                            <label className="text-xs uppercase tracking-widest text-[#c5a059] mb-3">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={styles.selectInput}
                            >
                                <option value="upper_body">Upper Body (T-Shirt, Shirt, Jacket)</option>
                                <option value="lower_body">Lower Body (Pants, Jeans, Shorts)</option>
                                <option value="dresses">Full Body (Suit, Robe)</option>
                            </select>
                        </div>

                        {/* Advanced Settings Toggle */}
                        <div className={styles.inputGroup}>
                            <label className={styles.toggleLabel}>
                                <input
                                    type="checkbox"
                                    checked={useHQ}
                                    onChange={(e) => setUseHQ(e.target.checked)}
                                    className={styles.checkbox}
                                />
                                <span className="uppercase text-[10px] tracking-wider">High Quality Rendering</span>
                            </label>
                        </div>
                    </div>

                    <button
                        className={styles.generateBtn}
                        onClick={handleGenerate}
                        disabled={loading || !personImage || !garmentImage}
                    >
                        {loading ? "Processing..." : "Virtual Fitting"}
                    </button>

                    {/* Size Guide Link - Moved to bottom as requested */}
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <button
                            onClick={() => setIsSizeModalOpen(true)}
                            className="text-[#c5a059] text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors border border-[#c5a059]/30 px-4 py-2"
                        >
                            <Ruler size={12} />
                            Find My Size
                        </button>

                        {recommendedSize && (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                                <p className="text-[#c5a059] font-bold text-sm tracking-wider">Recommended: {recommendedSize.size}</p>
                                <p className="text-[10px] text-white/40 italic">{recommendedSize.note}</p>
                            </div>
                        )}
                    </div>

                    {/* Contact Info Footer */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4 w-full">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Mijozlar Xizmati</p>
                        <div className="flex items-center gap-10">
                            <a href="https://t.me/Adamari_mens" target="_blank" className="text-[#c5a059]/80 hover:text-[#c5a059] transition-all hover:scale-110">
                                <Send size={24} />
                            </a>
                            <a href="https://instagram.com/adamari_uzbekistan" target="_blank" className="text-[#c5a059]/80 hover:text-[#c5a059] transition-all hover:scale-110">
                                <Instagram size={24} />
                            </a>
                            <a href="tel:+998555100100" className="text-[#c5a059]/80 hover:text-[#c5a059] transition-all hover:scale-110">
                                <Phone size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - RESULT */}
                <div className={styles.resultArea}>
                    <div className="flex flex-col gap-2 mb-6">
                        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
                            Virtual <span className="text-[#c5a059] italic">Kiyinish Xonasi</span>
                        </h1>
                        <p className="text-white/40 text-sm max-w-md">
                            Sun'iy intellekt yordamida kiyimlarni onlayn kiyib ko'ring.
                        </p>
                    </div>
                    <div className={styles.resultContainer}>
                        {loading && (
                            <div className={styles.loading}>
                                <div className={styles.spinner}></div>
                                <p className="text-xs uppercase tracking-[0.2em] text-[#c5a059] animate-pulse">
                                    {statusText === "starting" ? "Initializing AI..." :
                                        statusText === "processing" ? "Analyzing Fabric & Fit..." :
                                            "Finalizing Look..."}
                                </p>
                            </div>
                        )}

                        {resultImage ? (
                            <>
                                <img src={resultImage} alt="Virtual Try-On Result" className={styles.resultImage} />
                                <div className={styles.resultActions}>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className={styles.actionBtn}
                                        title="Boshqatdan"
                                    >
                                        <RefreshCw size={20} />
                                    </button>
                                    <ShareButton imageUrl={resultImage} />
                                </div>
                                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-3">
                                    <button
                                        onClick={downloadImage}
                                        className="w-full py-3 bg-[#c5a059] text-[#0f172a] font-bold text-xs uppercase tracking-widest hover:bg-[#e0b860] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} />
                                        Rasmni Yuklab Olish
                                    </button>
                                    <button className={styles.buyBtn}>
                                        <ShoppingBag size={14} /> Sotib Olish
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-4">
                                    <span className="font-serif text-3xl text-white/20 italic">a</span>
                                </div>
                                <p className={styles.placeholderText}>Natija shu yerda chiqadi</p>
                                {loading && <p className="text-xs text-[#c5a059] mt-4 animate-pulse">AI ishlamoqda...</p>}
                            </div>
                        )}
                    </div>

                    {/* Debug Error Display */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-xs">
                            <strong>Xatolik:</strong> {error}
                            <br />
                            <span className="opacity-50">Iltimos, qayta urinib ko'ring yoki kichikroq rasm yuklang.</span>
                        </div>
                    )}

                    {/* Related Products Recommendation */}
                    {resultImage && recommendedSize && (
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px bg-[#c5a059]/30 flex-1"></div>
                                <h3 className="uppercase text-xs tracking-[0.3em] text-[#c5a059]">Complete the Look</h3>
                                <div className="h-px bg-[#c5a059]/30 flex-1"></div>
                            </div>
                            <RelatedProducts />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <SizeInputModal
                isOpen={isSizeModalOpen}
                onClose={() => setIsSizeModalOpen(false)}
                onRecommendation={(size, note) => setRecommendedSize({ size, note })}
            />

            {error && (
                <div className="fixed top-6 right-6 z-[200] bg-red-900/90 text-white px-6 py-4 rounded shadow-2xl border-l-4 border-red-500 backdrop-blur-md max-w-md animate-in slide-in-from-right">
                    <div className="flex justify-between items-start mb-2">
                        <strong className="uppercase text-xs tracking-wider text-red-200">System Error</strong>
                        <button onClick={() => setError(null)} className="text-white/50 hover:text-white">✕</button>
                    </div>
                    <p className="text-sm font-light">{error}</p>
                    {error.includes("422") && (
                        <p className="text-xs text-red-300 mt-2 border-t border-red-800 pt-2">
                            Tip: Try refreshing the page or checking your internet connection.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function TryOnPage() {
    return (
        <Suspense fallback={<div>Loading Fitting Room...</div>}>
            <TryOnContent />
        </Suspense>
    );
}
