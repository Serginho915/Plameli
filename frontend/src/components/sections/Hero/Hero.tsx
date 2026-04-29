"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./Hero.translations";
import styles from "./Hero.module.scss";

export const Hero = () => {
  const { t } = useTranslation(translations);

  return (
    <section className={styles.hero}>
      {/* Top section: text + image */}
      <div className={styles.top}>
        <div className={styles.textBlock}>
          <div className={styles.titles}>
            <h1>{t.title}</h1>
            <h2>{t.subtitle}</h2>
          </div>
          <p className={styles.description}>{t.description}</p>

          {/* Forbes banner — inside textBlock on desktop, overlay on mobile */}
          <div className={styles.forbesBannerDesktop}>
            <div className={styles.forbesBanner}>
              <p>{t.forbesBanner}</p>
              <span className={styles.forbesIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 15L15 5M15 5H8M15 5V12"
                    stroke="#697B91"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <Image
            src="/images/Hero/HeroImage.png"
            alt={t.title}
            width={520}
            height={560}
            className={styles.heroImage}
            priority
          />
          {/* Forbes banner overlay — only on mobile */}
          <div className={styles.forbesBannerMobile}>
            <div className={styles.forbesBanner}>
              <p>{t.forbesBanner}</p>
              <span className={styles.forbesIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 15L15 5M15 5H8M15 5V12"
                    stroke="#697B91"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{t.stat1Value}</span>
          <p className={styles.statLabel}>{t.stat1Label}</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{t.stat2Value}</span>
          <p className={styles.statLabel}>{t.stat2Label}</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{t.stat3Value}</span>
          <p className={styles.statLabel}>{t.stat3Label}</p>
        </div>
        <div className={`${styles.statCard} ${styles.siteCard}`}>
          <div className={styles.siteTop}>
            <Image
              src="/images/logo.svg"
              alt="Plameli logo"
              width={28}
              height={36}
              className={styles.siteLogo}
            />
            <span className={styles.siteName}>{t.siteName}</span>
          </div>
          <a href="https://plameli.com" target="_blank" rel="noopener noreferrer" className={styles.siteLink}>
            {t.siteLink}
            <span className={styles.siteLinkIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 15L15 5M15 5H8M15 5V12"
                  stroke="#697B91"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
