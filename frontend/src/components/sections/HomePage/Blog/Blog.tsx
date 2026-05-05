"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle';
import { BlogCard } from '@/components/ui/BlogCard/BlogCard';
import { translations, BlogItem, BlogTranslations } from './Blog.translations';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Blog.module.scss';

export const Blog = () => {
  const { t, language } = useTranslation<BlogTranslations>(translations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const isInitialMount = useRef(true);

  const items = t.items || [];
  
  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(items.length - 1);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPrevIndex(currentIndex);
    }, 600); // Should match the transition duration
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const cardWidth = 367;
  const gap = 32;
  const step = cardWidth + gap;
  const dotStep = 18; // 10px dot + 8px gap

  // Stretchy "Worm" Logic
  const startX = prevIndex * dotStep;
  const targetX = currentIndex * dotStep;
  const distance = Math.abs(targetX - startX);

  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />
        
        <div className={styles.carouselWrapper}>
          <div className={styles.carouselViewport}>
            <motion.div
              className={styles.track}
              animate={{ x: -(currentIndex * step) }}
              transition={{ 
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1]
              }}
            >
              {items.map((item: BlogItem, index: number) => (
                <BlogCard
                  key={index}
                  authorLabel={t.authorPrefix}
                  authorName={item.author}
                  title={item.title}
                  readLabel={t.readMore}
                  href={`/${language}${item.href}`}
                  className={styles.card}
                />
              ))}
            </motion.div>
          </div>

          <div className={styles.controls}>
            <div className={styles.arrows}>
              <button 
                className={styles.arrowBtn} 
                onClick={handlePrev}
                aria-label="Previous"
              >
                <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className={`${styles.arrowBtn} ${styles.next}`} 
                onClick={handleNext}
                aria-label="Next"
              >
                <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <LayoutGroup>
              <div className={styles.pagination}>
                {items.map((_, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <motion.div
                      key={index}
                      layout
                      className={`${styles.dotWrapper} ${isActive ? styles.active : ''}`}
                      onClick={() => setCurrentIndex(index)}
                      transition={{
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    />
                  );
                })}
                
                <motion.div
                  className={styles.activePill}
                  initial={false}
                  animate={{
                    x: currentIndex > prevIndex 
                      ? [startX, startX, targetX] 
                      : [startX, targetX, targetX],
                    width: [51, 51 + distance, 51]
                  }}
                  transition={{
                    duration: 0.6,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                  }}
                />
              </div>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
};
