"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { Button } from "@/components/ui/Button/Button.tsx";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { translations } from "./Services.translations.ts";
import { CheckIcon } from "@/components/ui/Icons/CheckIcon/CheckIcon.tsx";
import styles from "./Services.module.scss";
import { Education } from "../Education/Education.tsx";

export const Services = () => {
  const { t } = useTranslation(translations);
  const { lang } = useParams();
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDetailsClick = () => {
    setShowDetails(true);
  };

  return (
    <section className={styles.services}>
      <SectionTitle text={t.title} />

      {/* Card Header (Above the block) */}
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>
          <span className={styles.cardTitleDesktop}>{t.cardTitle}</span>
          <span className={styles.cardTitleMobile}>{t.cardTitleMobile}</span>
        </h4>
        <span className={styles.badge}>{t.badge}</span>
      </div>

      {/* Main Content (White Box) */}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          {/* Left Column: Card + Process */}
          <div className={styles.leftColumn}>
            {/* Consultation Card */}
            <div className={styles.consultationCard}>
              <div className={styles.cardImage}>
                <Image
                  src="/images/Services/consultation.png"
                  alt={t.cardTitle}
                  width={309}
                  height={309}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardInfo}>
                <h5 className={styles.cardDescription}>{t.description}</h5>
                <ul className={styles.cardMeta}>
                  <li className={styles.metaRow}>
                    <span className={styles.metaLabel}>{t.timeLabel}</span>
                    <span className={styles.metaValue}>{t.timeValue}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <span className={styles.metaLabel}>{t.formatLabel}</span>
                    <span className={styles.metaValue}>{t.formatValue}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <span className={styles.metaLabel}>{t.priceLabel}</span>
                    <span className={styles.metaValue}>
                      {t.pricePrefix && (
                        <span className={styles.pricePrefix}>{t.pricePrefix}</span>
                      )}
                      {t.priceValue}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Process Block */}
            <div
              className={`${styles.processBlock} ${isMobile && !showDetails ? styles.hidden : ""}`}
            >
              <h6 className={styles.blockTitle}>{t.processTitle}</h6>
              <ul className={styles.processSteps}>
                {t.processSteps.map((step: string, index: number) => (
                  <li key={index} className={styles.processStep}>
                    <CheckIcon />
                    <p>{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Request + Result */}
          <div
            className={`${styles.rightColumn} ${isMobile && !showDetails ? styles.hidden : ""}`}
          >
            {/* Your Request */}
            <div className={styles.requestBlock}>
              <h6 className={styles.blockTitle}>{t.requestTitle}</h6>
              <ul className={styles.requestList}>
                {t.requestItems.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Your Result */}
            <div className={styles.resultBlock}>
              <h6 className={styles.blockTitle}>{t.resultTitle}</h6>
              <ul className={styles.resultList}>
                {t.resultItems.map((item: string, index: number) => (
                  <li key={index}>
                    <span className={styles.plusIcon}>+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Buttons Row (Inside White Box) */}
        <div className={styles.buttonsRow}>
          {isMobile && !showDetails ? (
            <Button variant="outline" onClick={handleDetailsClick}>
              {t.details}
            </Button>
          ) : (
            <Link
              href={`/${lang}/consultation`}
              className={styles.buttonLink}
            >
              <Button variant="outline">{t.learnMore}</Button>
            </Link>
          )}
          <Link
            href={`/${lang}/consultation#form`}
            className={styles.buttonLink}
          >
            <Button variant="filled">{t.signUp}</Button>
          </Link>
        </div>
      </div>

      <Education />
    </section>
  );
};
