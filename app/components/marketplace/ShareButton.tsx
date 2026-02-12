"use client";

import { Share2, Instagram } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
    imageUrl: string;
    title?: string;
    text?: string;
}

export default function ShareButton({ imageUrl, title = "Mening yangi stilim!", text = "Stiluz orqali virtual kiyib ko'rdim. @adamari_mens" }: ShareButtonProps) {
    const [sharing, setSharing] = useState(false);

    const handleShare = async () => {
        setSharing(true);
        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                // Fetch the image to create a File object (needed for some share targets)
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], "style.png", { type: blob.type });

                await navigator.share({
                    title: title,
                    text: text,
                    files: [file]
                });
            } else {
                // Fallback: Copy to clipboard or open Instagram (if possible via deep link, though image sharing is hard via web)
                // For now, let's just create a temporary link/textarea to copy
                await navigator.clipboard.writeText(`${title} ${text} ${imageUrl}`);
                alert("Link nusxalandi! Instagramga joylash uchun rasmni yuklab oling.");
            }
        } catch (error) {
            console.error("Sharing failed", error);
        } finally {
            setSharing(false);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-xs tracking-wide hover:shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95"
        >
            <Instagram size={16} />
            <span>STORYGA JOYLANSH</span>
        </button>
    );
}
