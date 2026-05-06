"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, LayoutGroup, animate } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle';
import { BlogCard } from '@/components/ui/BlogCard/BlogCard';
import { translations, BlogItem, BlogTranslations } from './Blog.translations';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Blog.module.scss';

export const Blog = () => {
  const { t, language } = useTranslation<BlogTranslations>(translations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTablet, setIsTablet] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const items = t.items || [];
  
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 768);
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  const getItemWidth = () => {
    if (window.innerWidth <= 480) return 284 + 20;
    if (window.innerWidth <= 768) return 328 + 20;
    return 367 + 32;
  };

  const scrollTo = (index: number) => {
    if (isTablet && viewportRef.current) {
      const itemWidth = getItemWidth();
      const targetScroll = index * itemWidth;
      
      // Ultra smooth spring animation for premium feel
      animate(viewportRef.current.scrollLeft, targetScroll, {
        type: "spring",
        stiffness: 60, // Lower stiffness for "heavy" smooth motion
        damping: 20,
        mass: 1.2,
        onUpdate: (val) => {
          if (viewportRef.current) viewportRef.current.scrollLeft = val;
        }
      });
    } else {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    scrollTo(nextIndex);
  };

  const handlePrev = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    scrollTo(prevIdx);
  };

  const handleScroll = () => {
    if (!isTablet || !viewportRef.current) return;
    
    const scrollLeft = viewportRef.current.scrollLeft;
    const itemWidth = getItemWidth();
    const newIndex = Math.round(scrollLeft / itemWidth);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPrevIndex(currentIndex);
    }, 800); // Increased to match new smoother duration
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const cardWidth = 367;
  const gap = 32;
  const step = cardWidth + gap;
  const dotStep = 18;

  const startX = prevIndex * dotStep;
  const targetX = currentIndex * dotStep;
  const distance = Math.abs(targetX - startX);

  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />
        
        <div className={styles.carouselWrapper}>
          <div 
            className={styles.carouselViewport}
            ref={viewportRef}
            onScroll={handleScroll}
          >
            <motion.div
              className={styles.track}
              animate={isTablet ? { x: 0 } : { x: -(currentIndex * step) }}
              transition={{ 
                type: "spring",
                stiffness: 60,
                damping: 20,
                mass: 1.2
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
                      onClick={() => scrollTo(index)}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 20
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
                    duration: 0.8, // Increased for buttery smooth feel
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
