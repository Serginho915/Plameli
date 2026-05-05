"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button/Button";
import { translations } from "./Reviews.translations";
import styles from "./Reviews.module.scss";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";

export const Reviews = () => {
  const { t } = useTranslation(translations);

  return (
    <section className={styles.reviews}>
      <div className={styles.bgDecoration} />
      
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />

        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.testimonialWrapper}>
              <p className={styles.testimonial}>{t.testimonial}</p>
            </div>
            
            <div className={styles.statsRow}>
              <div className={`${styles.statCard} ${styles.before}`}>
                <div className={styles.badge}>{t.beforeLabel}</div>
                <div className={styles.statValue}>{t.beforeValue}</div>
                <p className={styles.statDesc}>{t.errorsLabel}</p>
              </div>

              <div className={`${styles.statCard} ${styles.after}`}>
                <div className={styles.badge}>{t.afterLabel}</div>
                <div className={styles.statValue}>{t.afterValue}</div>
                <p className={styles.statDesc}>{t.errorsLabel}</p>
              </div>
            </div>
          </div>

          <div className={styles.clientSection}>
            <div className={styles.displayArea}>
              <div className={styles.desktopImage}>
                <Image
                  src="/images/Reviews/Andrey.png"
                  alt={t.clientName}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.infoBar}>
                <div className={styles.avatar}>
                  <Image
                    src="/images/Reviews/Andrey.png"
                    alt={t.clientName}
                    width={104}
                    height={104}
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div className={styles.clientDetails}>
                  <div className={styles.nameGroup}>
                    <span className={styles.clientName}>{t.clientName}</span>
                    <span className={styles.clientTitle}>{t.clientTitle}</span>
                  </div>

                  <div className={styles.arrows}>
                    <div className={styles.arrowBtn}>
                      <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={`${styles.arrowBtn} ${styles.next}`}>
                      <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              <Button variant="primaryOutline" className={styles.ctaButton}>
                {t.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
