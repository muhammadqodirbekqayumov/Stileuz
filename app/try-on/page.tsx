"use client";

import { useState } from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import styles from "./page.module.css";
import { User, Shirt, Wand2, Download, Share2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function TryOnPage() {
    const [personImage, setPersonImage] = useState<File | null>(null);
    const [garmentImage, setGarmentImage] = useState<File | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Status State
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState(""); // E.g., "Kiyim kiygizilmoqda...", "Tiniqlashtirilmoqda..."

    // Config State
    const [category, setCategory] = useState("upper_body");
    const [description, setDescription] = useState("");

    // --- UNIVERSAL URL PARSER ---
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
            // --- STEP 1: START VTON ---
            setStatusText("1/2: Kiyim kiygizilmoqda (AI)...");

            const formData = new FormData();
            formData.append("type", "vton");
            formData.append("human_image", personImage);
            formData.append("garm_img", garmentImage);
            formData.append("category", category);
            formData.append("description", description);

            const vtonRes = await fetch("/api/predictions", { method: "POST", body: formData });
            const vtonData = await vtonRes.json();
            if (vtonData.error) throw new Error("VTON Start Error: " + vtonData.error);

            let vtonId = vtonData.id;
            let vtonResult = null;

            // Poll VTON
            while (!vtonResult) {
                await sleep(3000); // Wait 3s
                const statusRes = await fetch(`/api/predictions/${vtonId}`);
                const statusData = await statusRes.json();

                if (statusData.status === "succeeded") {
                    vtonResult = getSafeUrl(statusData.output);
                } else if (statusData.status === "failed" || statusData.status === "canceled") {
                    throw new Error("VTON Failed: " + (statusData.error || "Unknown error"));
                }
                // Else: starting, processing -> continue loop
            }

            console.log("VTON Done:", vtonResult);

            // --- STEP 2: START UPSCALE ---
            setStatusText("2/2: HD Sifatga o'tkazilmoqda...");

            const upscaleForm = new FormData();
            upscaleForm.append("type", "upscale");
            upscaleForm.append("image_url", vtonResult);

            const upRes = await fetch("/api/predictions", { method: "POST", body: upscaleForm });
            const upData = await upRes.json();
            if (upData.error) throw new Error("Upscale Start Error: " + upData.error);

            let upId = upData.id;
            let finalResult = null;

            // Poll Upscale
            while (!finalResult) {
                await sleep(3000);
                const statusRes = await fetch(`/api/predictions/${upId}`);
                const statusData = await statusRes.json();

                if (statusData.status === "succeeded") {
                    finalResult = getSafeUrl(statusData.output);
                } else if (statusData.status === "failed") {
                    throw new Error("Upscale Failed");
                }
            }

            console.log("Upscale Done:", finalResult);
            setResultImage(finalResult);
            setStatusText("Tayyor!");

        } catch (error: any) {
            console.error("Pipeline Error:", error);
            alert("Xatolik: " + (error.message || "Kutilmagan xato"));
            setStatusText("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.grid}>
                {/* Left Panel: Controls */}
                <motion.div
                    className={styles.panel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className={styles.title}>
                        CONFIGURATION
                    </div>

                    <div className={styles.uploadArea}>
                        <div className={styles.inputGroup}>
                            <p className={styles.stepTitle}>01 — MODEL</p>
                            <FileUpload
                                label="Upload Model"
                                sublabel="Drag & Drop or Click"
                                onFileSelect={setPersonImage}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <p className={styles.stepTitle}>02 — GARMENT</p>
                            <FileUpload
                                label="Upload Garment"
                                sublabel="Drag & Drop or Click"
                                onFileSelect={setGarmentImage}
                            />
                        </div>

                        {/* Category Selector */}
                        <div className={styles.inputGroup}>
                            <p className={styles.stepTitle}>03 — CATEGORY</p>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={styles.selectInput}
                                >
                                    <option value="upper_body">Upper Body (Top)</option>
                                    <option value="lower_body">Lower Body (Bottom)</option>
                                    <option value="dresses">Full Body (Dress/Suit)</option>
                                </select>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className={styles.inputGroup}>
                            <p className={styles.stepTitle}>04 — DETAILS (OPTIONAL)</p>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="E.g. Dark denim jeans, vintage wash..."
                                className={styles.textInput}
                                rows={3}
                            />

                            {/* AUTO-MATCH TOGGLE */}
                            <label className={styles.toggleLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setDescription(prev => prev + (prev ? ", " : "") + "full outfit matching style, cohesive look");
                                        } else {
                                            setDescription(prev => prev.replace(", full outfit matching style, cohesive look", "").replace("full outfit matching style, cohesive look", ""));
                                        }
                                    }}
                                />
                                <span>Auto-Match Style (Complete Look)</span>
                            </label>
                        </div>
                    </div>

                    <button
                        className={styles.generateBtn}
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? statusText || "PROCESSING..." : "GENERATE LOOK"}
                    </button>
                </motion.div>

                {/* Right Panel: Result */}
                <motion.div
                    className={styles.panel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className={styles.title} style={{ borderBottom: 'none' }}>
                        RESULT
                        <Share2 size={18} style={{ cursor: 'pointer' }} />
                    </div>

                    <div className={styles.resultArea}>
                        {loading ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <p style={{ fontSize: '12px', letterSpacing: '1px' }}>{statusText}</p>
                            </div>
                        ) : resultImage ? (
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <img
                                    src={resultImage}
                                    alt="Result"
                                    className={styles.resultImage}
                                />
                                <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
                                    <button
                                        onClick={() => window.open(resultImage, '_blank')}
                                        style={{
                                            background: '#fff',
                                            border: '1px solid #000',
                                            padding: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Download size={20} color="#000" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.placeholder}>
                                STILUZ
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
