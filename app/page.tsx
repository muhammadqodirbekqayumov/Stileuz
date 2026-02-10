"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "./components/Header";
import styles from "./page.module.css";
import { ArrowRight, Sparkles, Shirt, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>

        {/* HERO SECTION */}
        <section id="hero" className={styles.hero}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.title}>
              GOLDEN<br />
              <span className={styles.subtitle}>STANDARD AI FASHION</span>
            </h1>

            <p className={styles.description}>
              Elevate your style with AI. <br />
              Experience the pinnacle of virtual fitting.
            </p>

            <div className={styles.ctabox}>
              <Link href="/try-on" className="btn-primary">
                START EXPERIENCE
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className={styles.features}>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <span className={styles.featureNumber}>01</span>
              <h3>Imperial Match</h3>
              <p>AI designed to perfectly coordinate your attire.</p>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureNumber}>02</span>
              <h3>Royal Resolution</h3>
              <p>Crystal clear 8K output for the finest details.</p>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureNumber}>03</span>
              <h3>Instant Luxury</h3>
              <p>Premium results delivered in seconds.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
