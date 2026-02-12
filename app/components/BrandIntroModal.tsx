"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandIntroModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true);
    }, []);

    const handleClose = () => setIsOpen(false);

    // All styles are inline to avoid Tailwind dependency issues
    const styles = {
        overlay: {
            position: 'fixed' as const,
            inset: 0,
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column' as const,
            overflow: 'hidden',
            background: '#080d1a',
        },
        bgGlow1: {
            position: 'absolute' as const,
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            opacity: 0.3,
            background: 'radial-gradient(circle, rgba(99, 70, 255, 0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
            pointerEvents: 'none' as const,
        },
        bgGlow2: {
            position: 'absolute' as const,
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            opacity: 0.2,
            background: 'radial-gradient(circle, rgba(197, 160, 89, 0.5) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none' as const,
        },
        bgGlow3: {
            position: 'absolute' as const,
            top: '40%',
            left: '50%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            opacity: 0.15,
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none' as const,
        },
        contentWrapper: {
            position: 'relative' as const,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column' as const,
            height: '100%',
            overflowY: 'auto' as const,
        },
        leftSide: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            padding: '48px 32px',
        },
        rightSide: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            padding: '32px',
        },
        logoBox: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'flex-start',
            marginBottom: '32px',
        },
        logoImage: {
            height: '60px',
            width: 'auto',
            objectFit: 'contain' as const,
        },
        logoTextMain: {
            color: '#fff',
            fontWeight: 800,
            fontSize: '32px',
            fontFamily: 'Manrope, sans-serif',
            letterSpacing: '-1px',
            lineHeight: 1,
        },
        logoTextSub: {
            color: '#fff',
            fontSize: '10px',
            textTransform: 'lowercase' as const,
            letterSpacing: '1px',
            fontFamily: 'Manrope, sans-serif',
            marginLeft: '2px',
            opacity: 0.8,
        },
        heading: {
            fontSize: '42px',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '24px',
            fontFamily: 'Manrope, sans-serif',
        },
        headingGold: {
            background: 'linear-gradient(90deg, #c5a059, #e0b860, #c5a059)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        },
        subtitle: {
            color: 'rgba(255,255,255,0.5)',
            fontSize: '15px',
            maxWidth: '420px',
            lineHeight: 1.7,
            marginBottom: '40px',
            fontFamily: 'Manrope, sans-serif',
        },
        buttonRow: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '16px',
            marginBottom: '48px',
        },
        primaryBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #c5a059, #e0b860)',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '14px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Manrope, sans-serif',
            boxShadow: '0 4px 20px rgba(197, 160, 89, 0.3)',
            transition: 'all 0.3s',
        },
        secondaryBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            fontSize: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            fontFamily: 'Manrope, sans-serif',
            transition: 'all 0.3s',
        },
        contactBar: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            gap: '20px',
            fontSize: '13px',
        },
        contactLabel: {
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase' as const,
            fontSize: '10px',
            letterSpacing: '3px',
            fontWeight: 600,
            fontFamily: 'Manrope, sans-serif',
        },
        contactLink: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '13px',
            fontFamily: 'Manrope, sans-serif',
        },
        contactIcon: {
            color: '#c5a059',
            fontSize: '16px',
        },
        rightTitle: {
            color: '#fff',
            fontWeight: 700,
            fontSize: '20px',
            marginBottom: '6px',
            fontFamily: 'Manrope, sans-serif',
        },
        rightSubtitle: {
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px',
            marginBottom: '28px',
            fontFamily: 'Manrope, sans-serif',
        },
        cardsContainer: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '12px',
        },
        card: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px 20px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            textDecoration: 'none',
            transition: 'all 0.3s',
            cursor: 'pointer',
        },
        cardIconBox: (bg: string) => ({
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '22px',
        }),
        cardTitle: {
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: 'Manrope, sans-serif',
        },
        cardDesc: {
            color: 'rgba(255,255,255,0.4)',
            fontSize: '11px',
            marginTop: '3px',
            fontFamily: 'Manrope, sans-serif',
        },
        cardArrow: {
            color: 'rgba(255,255,255,0.2)',
            fontSize: '16px',
            marginLeft: 'auto',
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={styles.overlay}
                >
                    {/* Background Glows */}
                    <div style={styles.bgGlow1} />
                    <div style={styles.bgGlow2} />
                    <div style={styles.bgGlow3} />

                    <div style={styles.contentWrapper}>
                        {/* LEFT - Branding */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.7 }}
                            style={styles.leftSide}
                        >
                            {/* Logo */}
                            <div style={styles.logoBox}>
                                <div style={styles.logoTextMain}>adamari</div>
                                <div style={styles.logoTextSub}>family Store</div>
                            </div>

                            {/* Heading */}
                            <h1 style={styles.heading}>
                                Kiyimingizni<br />
                                <span style={styles.headingGold}>Virtual Kiyib</span><br />
                                <span style={styles.headingGold}>Ko&apos;ring</span>
                            </h1>

                            <p style={styles.subtitle}>
                                Sun&apos;iy intellekt yordamida o&apos;zingizga yoqqan kiyimni onlayn kiyib ko&apos;ring. Do&apos;konga borish shart emas!
                            </p>

                            {/* Buttons */}
                            <div style={styles.buttonRow}>
                                <button onClick={handleClose} style={styles.primaryBtn}>
                                    ✨ Boshlash
                                </button>
                                <button onClick={handleClose} style={styles.secondaryBtn}>
                                    Qanday ishlaydi? →
                                </button>
                            </div>

                            {/* Contact Bar */}
                            <div style={styles.contactBar}>
                                <span style={styles.contactLabel}>Murojaat uchun:</span>
                                <a href="tel:+998555100100" style={styles.contactLink}>
                                    <span style={styles.contactIcon}>📞</span> 555-100-100
                                </a>
                                <a href="https://t.me/Adamari_mens" target="_blank" style={styles.contactLink}>
                                    <span style={styles.contactIcon}>✈️</span> Telegram
                                </a>
                                <a href="https://instagram.com/adamari_uzbekistan" target="_blank" style={styles.contactLink}>
                                    <span style={styles.contactIcon}>📷</span> Instagram
                                </a>
                            </div>
                        </motion.div>

                        {/* RIGHT - Store Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.7 }}
                            style={styles.rightSide}
                        >
                            <h2 style={styles.rightTitle}>Adamari do&apos;koni</h2>
                            <p style={styles.rightSubtitle}>Premium erkaklar kiyimlari</p>

                            <div style={styles.cardsContainer}>
                                {/* Telegram */}
                                <a href="https://t.me/Adamari_mens" target="_blank" style={styles.card}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                >
                                    <div style={styles.cardIconBox('rgba(197, 160, 89, 0.1)')}>
                                        <span>✈️</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.cardTitle}>Telegram Kanal</div>
                                        <div style={styles.cardDesc}>@Adamari_mens — Yangiliklar, aksiyalar</div>
                                    </div>
                                    <span style={styles.cardArrow}>→</span>
                                </a>

                                {/* Instagram */}
                                <a href="https://instagram.com/adamari_uzbekistan" target="_blank" style={styles.card}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                >
                                    <div style={styles.cardIconBox('rgba(168, 85, 247, 0.1)')}>
                                        <span>📷</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.cardTitle}>Instagram</div>
                                        <div style={styles.cardDesc}>@adamari_uzbekistan — Lookbook, Yangi kelganlar</div>
                                    </div>
                                    <span style={styles.cardArrow}>→</span>
                                </a>

                                {/* Manager */}
                                <a href="https://t.me/adamaricommunitymanager" target="_blank" style={styles.card}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                >
                                    <div style={styles.cardIconBox('rgba(56, 189, 248, 0.1)')}>
                                        <span>💬</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.cardTitle}>Buyurtma berish</div>
                                        <div style={styles.cardDesc}>@adamaricommunitymanager — Maslahat, O&apos;lcham</div>
                                    </div>
                                    <span style={styles.cardArrow}>→</span>
                                </a>

                                {/* Location */}
                                <div style={styles.card}>
                                    <div style={styles.cardIconBox('rgba(52, 211, 153, 0.1)')}>
                                        <span>📍</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.cardTitle}>Manzil</div>
                                        <div style={styles.cardDesc}>Toshkent shahri</div>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div style={styles.card}>
                                    <div style={styles.cardIconBox('rgba(251, 191, 36, 0.1)')}>
                                        <span>🕐</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.cardTitle}>Ish vaqti</div>
                                        <div style={styles.cardDesc}>Har kuni 09:00 — 21:00</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
