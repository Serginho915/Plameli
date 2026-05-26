"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, animate } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import styles from "./SimilarMaterials.module.scss";

interface SimilarMaterialsProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  gridClassName?: string;
}

export const SimilarMaterials: React.FC<SimilarMaterialsProps> = ({
  title,
  children,
  className = "",
  gridClassName = "",
}) => {
  const childrenArray = React.Children.toArray(children);
  const itemCount = childrenArray.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTablet, setIsTablet] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 1024);
    };
    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  const getItemWidth = () => {
    if (typeof window === "undefined") return 644 + 24;
    if (window.innerWidth <= 480) return window.innerWidth - 32 + 16;
    if (window.innerWidth <= 768) return window.innerWidth - 48 + 16;
    if (window.innerWidth <= 1024) return 600 + 24;
    return 644 + 24;
  };

  const scrollTo = (index: number) => {
    if (index < 0 || index >= itemCount) return;
    
    if (isTablet && viewportRef.current) {
      const itemWidth = getItemWidth();
      const targetScroll = index * itemWidth;
      
      animate(viewportRef.current.scrollLeft, targetScroll, {
        type: "spring",
        stiffness: 60,
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
    const nextIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : 0;
    scrollTo(nextIndex);
  };

  const handlePrev = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : itemCount - 1;
    scrollTo(prevIdx);
  };

  const handleScroll = () => {
    if (!isTablet || !viewportRef.current) return;
    
    const { scrollLeft, offsetWidth, scrollWidth } = viewportRef.current;
    const itemWidth = getItemWidth();
    
    const isAtEnd = scrollLeft + offsetWidth >= scrollWidth - 5;
    let newIndex = Math.round(scrollLeft / itemWidth);
    
    if (isAtEnd) {
      newIndex = itemCount - 1;
    }
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < itemCount) {
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
    }, 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const cardWidth = 644;
  const gap = 24;
  const step = cardWidth + gap;
  const dotStep = 18;

  const startX = prevIndex * dotStep;
  const targetX = currentIndex * dotStep;
  const distance = Math.abs(targetX - startX);

  if (itemCount === 0) return null;

  return (
    <section className={`${styles.similarSection} ${className}`}>
      <div className={styles.similarContainer}>
        <SectionTitle text={title} />
        
        {itemCount <= 2 ? (
          <div className={`${styles.similarGrid} ${gridClassName}`}>
            {children}
          </div>
        ) : (
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
                {childrenArray.map((child, index) => (
                  <div key={index} className={styles.slide}>
                    {child}
                  </div>
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
                    <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button 
                  className={`${styles.arrowBtn} ${styles.next}`} 
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1L1.5 9.5L10 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className={styles.pagination}>
                {childrenArray.map((_, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <div
                      key={index}
                      className={`${styles.dotWrapper} ${isActive ? styles.active : ''}`}
                      onClick={() => scrollTo(index)}
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
                    duration: 0.8,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
