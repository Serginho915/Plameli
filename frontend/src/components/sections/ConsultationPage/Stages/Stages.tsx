"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { translations } from "./Stages.translations.ts";
import styles from "./Stages.module.scss";
import stagesBg from "../../../../../public/images/Stages/stages_bg.png";

export const Stages = () => {
  const { t } = useTranslation(translations);
  const [activeStep, setActiveStep] = React.useState(0);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          intervalId = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % t.steps.length);
          }, 800);
        } else {
          if (intervalId) clearInterval(intervalId);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      observer.disconnect();
    };
  }, [t.steps.length]);

  return (
    <section className={styles.stages} ref={sectionRef}>
      <SectionTitle text={t.title} />

      <div className={styles.container}>
        {/* Top area: steps + image */}
        <div className={styles.topRow}>
          {/* Steps list */}
          <div className={styles.stepsBlock}>
              <ol className={styles.stepsList}>
                {t.steps.map(
                  (
                    step: { title: string; description: string },
                    index: number,
                  ) => (
                    <li
                      key={index}
                      className={`${styles.stepItem} ${activeStep === index ? styles.active : ""}`}
                    >
                      <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>{step.title}</h4>
                        <p className={styles.stepDescription}>
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ol>

              {/* Additional item */}
              <div className={styles.additionalItem}>
                <div className={styles.additionalContent}>
                  <span className={styles.additionalTitle}>
                    {t.additionalTitle}
                  </span>
                  <p className={styles.additionalText}>{t.additionalText}</p>
                </div>
              </div>
          </div>

          {/* Image block */}
          <div className={styles.imageBlock}>
            <Image
              src={stagesBg}
              alt="Consultation session"
              fill
              className={styles.bgImage}
            />
            <div className={styles.resultOverlay}>
              <div className={styles.resultContent}>
                <h4 className={styles.resultTitle}>{t.resultTitle}</h4>
                <p className={styles.resultSubtitle}>{t.resultSubtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom result cards */}
        <div className={styles.resultsGrid}>
          {t.results.map((result: string, index: number) => (
            <div
              key={index}
              className={`${styles.resultCard} ${index === 2 ? styles.highlighted : ""}`}
            >
              <div className={styles.cardIcon}>
                <Image
                  src={`/icons/steps/icon${index + 1}.svg`}
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <span className={styles.cardText}>{result}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
