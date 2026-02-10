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
    ShoppingBag
} from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    // Config State
    const [category, setCategory] = useState("upper_body");
    const [autoMatch, setAutoMatch] = useState(true);

    const getSafeUrl = (imgData: any): string => {
        if (!imgData) return "";
        if (typeof imgData === 'string') return imgData;
        if (Array.isArray(imgData) && imgData.length > 0) return getSafeUrl(imgData[0]);
        if (typeof imgData === 'object') return imgData.url || imgData.uri || imgData.output || "";
        return "";
    }

    const handleGenerate = async () => {
        if (!personImage || !garmentImage) {
            alert("Iltimos, ikkala rasmni ham yuklang!");
            return;
        }

        setLoading(true);
        setResultImage(null);

        try {
            setStatusText("1/2: Kiyim kiygizilmoqda (AI)...");

            const formData = new FormData();
            formData.append("type", "vton");

            if (typeof personImage === 'string') {
                formData.append("human_image_url", personImage);
            } else {
                formData.append("human_image", personImage);
            }

            if (typeof garmentImage === 'string') {
                formData.append("garm_img_url", garmentImage);
            } else {
                formData.append("garm_img", garmentImage);
            }

            formData.append("category", category);
            if (autoMatch) {
                formData.append("description", "full outfit matching style, cohesive look");
            }

            const vtonRes = await fetch("/api/predictions", { method: "POST", body: formData });
            const vtonData = await vtonRes.json();
            if (vtonData.error) throw new Error("VTON Start Error: " + vtonData.error);

            let vtonId = vtonData.id;
            let vtonResult = null;

            while (!vtonResult) {
                await sleep(3000);
                const statusRes = await fetch(`/api/predictions/${vtonId}`);
                const statusData = await statusRes.json();

                if (statusData.status === "succeeded") {
                    vtonResult = getSafeUrl(statusData.output);
                } else if (statusData.status === "failed" || statusData.status === "canceled") {
                    throw new Error("VTON Failed");
                }
            }

            setStatusText("2/2: HD Sifatga o'tkazilmoqda...");
            const upscaleForm = new FormData();
            upscaleForm.append("type", "upscale");
            upscaleForm.append("image_url", vtonResult);

            const upRes = await fetch("/api/predictions", { method: "POST", body: upscaleForm });
            const upData = await upRes.json();

            let upId = upData.id;
            let finalResult = null;

            while (!finalResult) {
                await sleep(3000);
                const statusRes = await fetch(`/api/predictions/${upId}`);
                const statusData = await statusRes.json();

                if (statusData.status === "succeeded") {
                    const aiResult = getSafeUrl(statusData.output);

                    if (brand && brand.logoUrl) {
                        setStatusText("BREND LOGOTIPI QO'YILMOQDA...");
                        try {
                            const watermarkRes = await fetch("/api/predictions/process", {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    imageUrl: aiResult,
                                    logoUrl: `${window.location.origin}${brand.logoUrl}`
                                })
                            });
                            const wData = await watermarkRes.json();
                            finalResult = wData.watermarkedImage || aiResult;
                        } catch (e) {
                            finalResult = aiResult;
                        }
                    } else {
                        finalResult = aiResult;
                    }
                } else if (statusData.status === "failed") {
                    throw new Error("Upscale Failed");
                }
            }

            setResultImage(finalResult);
            setStatusText("Tayyor!");

        } catch (error: any) {
            alert("Xatolik: " + (error.message || "Kutilmagan xato"));
            setStatusText("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement("a");
        link.href = resultImage;
        link.download = "stiluz-result.png";
        link.click();
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.grid}>
                <motion.div
                    className={styles.panel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className={styles.title} style={{ color: brand.primaryColor }}>
                        {brand.name.toUpperCase()} FITTING
                        <Sparkles size={24} />
                    </h1>

                    {brand.welcomeMessage && (
                        <p className={styles.brandWelcome}>{brand.welcomeMessage}</p>
                    )}

                    <div className={styles.uploadArea}>
                        <div className={styles.inputGroup}>
                            <h3 className={styles.stepTitle}>1. RASMINGIZNI YUKLANG</h3>
                            <FileUpload
                                onFileSelect={setPersonImage}
                                label="O'zingizni rasmingizni yuklang"
                                sublabel="To'liq tana yoki yarim tana"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <h3 className={styles.stepTitle}>2. KIYIM TANLANG</h3>
                            {typeof garmentImage === 'string' && garmentImage ? (
                                <div className={styles.preloadedGarment}>
                                    <img src={garmentImage} alt="Garment" />
                                    <button onClick={() => setGarmentImage(null)}>O'zgartirish</button>
                                </div>
                            ) : (
                                <FileUpload
                                    onFileSelect={setGarmentImage}
                                    label="Kiyim rasmini yuklang"
                                    sublabel="Svitshot, ko'ylak, shim..."
                                />
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <h3 className={styles.stepTitle}>3. SOZLAMALAR</h3>
                            <select
                                className={styles.selectInput}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="upper_body">Tepa qism (Upper)</option>
                                <option value="lower_body">Pastki qism (Lower)</option>
                                <option value="dresses">Ko'ylak (Dress)</option>
                            </select>

                            <label className={styles.toggleLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={autoMatch}
                                    onChange={(e) => setAutoMatch(e.target.checked)}
                                />
                                AI Stilist (Auto-Match)
                            </label>
                        </div>

                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerate}
                            disabled={loading || !personImage || !garmentImage}
                            style={{
                                opacity: (loading || !personImage || !garmentImage) ? 0.5 : 1,
                                background: brand.primaryColor
                            }}
                        >
                            {loading ? statusText || "YUKLANMOQDA..." : "KIYIB KO'RISH"}
                        </button>
                    </div>
                </motion.div>

                <div className={styles.resultArea}>
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                className={styles.loading}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="loading"
                            >
                                <div className={styles.spinner} style={{ borderTopColor: brand.primaryColor }}></div>
                                <p>{statusText}</p>
                            </motion.div>
                        ) : resultImage ? (
                            <motion.div
                                className={styles.resultContainer}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key="result"
                            >
                                <img src={resultImage} alt="Result" className={styles.resultImage} />

                                <div className={styles.resultActions}>
                                    <button onClick={handleDownload} className={styles.actionBtn}>
                                        <Download size={20} />
                                    </button>
                                    <button onClick={() => setResultImage(null)} className={styles.actionBtn}>
                                        <RefreshCw size={20} />
                                    </button>
                                </div>

                                <a
                                    href={`https://t.me/${brand.telegramUser}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.buyBtn}
                                    style={{ background: brand.primaryColor }}
                                >
                                    <ShoppingBag size={20} />
                                    ZAKAZ QILISH (TELEGRAM)
                                </a>
                            </motion.div>
                        ) : (
                            <div className={styles.placeholder} key="placeholder">
                                <Sparkles size={48} style={{ opacity: 0.2, marginBottom: 20, color: brand.primaryColor }} />
                                NATIJA SHU YERDA CHIQADI
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
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
