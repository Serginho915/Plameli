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
        <SectionTitle text={t.title} />

        <div className={styles.content}>
          {/* Left Column: Testimonial + Stats */}
          <div className={styles.leftColumn}>
            <div className={styles.testimonialBox}>
              <p className={styles.testimonial}>{t.testimonial}</p>
            </div>
            
            <div className={styles.statsGrid}>
              {/* Before Card */}
              <div className={`${styles.statCard} ${styles.before}`}>
                <div className={styles.badge}>{t.beforeLabel}</div>
                <div className={styles.statValue}>{t.beforeValue}</div>
                <p className={styles.statDesc}>{t.errorsLabel}</p>
              </div>

              {/* After Card */}
              <div className={`${styles.statCard} ${styles.after}`}>
                <div className={styles.badge}>{t.afterLabel}</div>
                <div className={styles.statValue}>{t.afterValue}</div>
                <p className={styles.statDesc}>{t.errorsLabel}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Image + CTA */}
          <div className={styles.rightColumn}>
            <div className={styles.imageBox}>
              <Image
                src="/images/Reviews/ekaterina.png"
                alt={t.clientName}
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.clientInfo}>
                <span className={styles.clientName}>{t.clientName}</span>
                <span className={styles.clientTitle}>{t.clientTitle}</span>
              </div>
            </div>

            <div className={styles.ctaButton}>
              <Button variant="outline" className={styles.ctaButton}>
                {t.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
