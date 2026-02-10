"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

export default function Header() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.header
            className={styles.header}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link href="/" className={styles.logo}>
                STILUZ
            </Link>

            <nav className={styles.nav}>
                <button onClick={() => scrollToSection('hero')} className={styles.link}>Asosiy</button>
                <button onClick={() => scrollToSection('features')} className={styles.link}>Imkoniyatlar</button>
                <Link href="/try-on" className="btn-primary">
                    Sinab ko'rish
                </Link>
            </nav>
        </motion.header>
    );
}
