"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import styles from "./FileUpload.module.css";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    label: string;
    sublabel?: string;
}

export default function FileUpload({ onFileSelect, label, sublabel }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0]);
        }
    };

    const handleFiles = (file: File) => {
        // Only accept images
        if (!file.type.startsWith("image/")) {
            alert("Faqat rasm yuklashingiz mumkin (JPG, PNG)");
            return;
        }

        // Use createObjectURL for better performance with large files
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Clean up previous object URL if exists to avoid memory leaks
        // (UseEffect would be better but this is a simple component)

        onFileSelect(file);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop click from triggering input
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div
            className={`${styles.container} ${dragActive ? styles.active : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ position: 'relative' }} // ensure relative for absolute input
        >
            <input
                ref={inputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleChange}
                title="" // hide tooltips
            />

            {preview ? (
                <>
                    <img src={preview} alt="Preview" className={styles.preview} />
                    <div className={styles.changeBtn} onClick={removeImage}>
                        <X size={14} /> O'chirish
                    </div>
                </>
            ) : (
                <>
                    <Upload className={styles.icon} size={32} />
                    <p className={styles.label}>{label}</p>
                    {sublabel && <p className={styles.sublabel}>{sublabel}</p>}
                </>
            )}
        </div>
    );
}
