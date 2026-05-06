"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { Button } from "@/components/ui/Button/Button.tsx";
import { translations } from "./Reviews.translations.ts";
import { reviewsData } from "./Reviews.data.ts";
import styles from "./Reviews.module.scss";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";

export const Reviews = () => {
  const { t, language } = useTranslation(translations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Get localized reviews from data file
  const reviews = reviewsData[language as keyof typeof reviewsData] || reviewsData.ru;
  const currentReview = reviews[currentIndex] || reviews[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <section className={styles.reviews}>
      <div className={styles.bgDecoration} />
      
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />

        <div className={styles.content}>
          <div className={styles.mainContent}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className={styles.animatedContent}
              >
                <div className={styles.testimonialWrapper}>
                  <p className={styles.testimonial}>{currentReview.testimonial}</p>
                </div>
                
                <div className={styles.statsRow}>
                  <div className={`${styles.statCard} ${styles.before}`}>
                    <div className={styles.badge}>{t.beforeLabel}</div>
                    <div className={styles.statValue}>{currentReview.beforeValue}</div>
                    <p className={styles.statDesc}>{t.errorsLabel}</p>
                  </div>

                  <div className={`${styles.statCard} ${styles.after}`}>
                    <div className={styles.badge}>{t.afterLabel}</div>
                    <div className={styles.statValue}>{currentReview.afterValue}</div>
                    <p className={styles.statDesc}>{t.errorsLabel}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.clientSection}>
            <div className={styles.displayArea}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className={styles.desktopImage}
                >
                  <Image
                    src={currentReview.image}
                    alt={currentReview.clientName}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </motion.div>
              </AnimatePresence>

              <div className={styles.infoBar}>
                <div className={styles.avatar}>
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={{
                        enter: { opacity: 0, scale: 0.8 },
                        center: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.8 }
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                      <Image
                        src={currentReview.image}
                        alt={currentReview.clientName}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className={styles.clientDetails}>
                  <div style={{ flex: 1, position: 'relative', height: '60px' }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                      <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={{
                          enter: { y: 20, opacity: 0 },
                          center: { y: 0, opacity: 1 },
                          exit: { y: -20, opacity: 0 }
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className={styles.nameGroup}
                        style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}
                      >
                        <span className={styles.clientName}>{currentReview.clientName}</span>
                        <span className={styles.clientTitle}>{currentReview.clientTitle}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className={styles.arrows}>
                    <div className={styles.arrowBtn} onClick={handlePrev}>
                      <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={`${styles.arrowBtn} ${styles.next}`} onClick={handleNext}>
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
