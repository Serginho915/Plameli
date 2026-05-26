"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { Button } from "@/components/ui/Button/Button.tsx";
import { translations } from "./Problems.translations.ts";
import styles from "./Problems.module.scss";
import expertAvatar from "../../../../../public/images/Problems/expert_avatar.png";

export const Problems = () => {
  const { t } = useTranslation(translations);
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  // Statuses for list items: "" (idle), 'growing', 'active'
  const [statuses, setStatuses] = React.useState<string[]>(() =>
    t.problems ? new Array(t.problems.length).fill("") : []
  );

  // Intersection Observer to detect when section is in view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isInView || !t.problems) return;

    let currentIndex = 0;
    const totalInterval = 600; // Slightly faster than hero for a list

    const intervalId = setInterval(() => {
      if (currentIndex >= t.problems.length) {
        clearInterval(intervalId);
        return;
      }

      const indexToProcess = currentIndex;

      setStatuses(prev => {
        const next = [...prev];
        next[indexToProcess] = "growing";
        return next;
      });

      setTimeout(() => {
        setStatuses(prev => {
          const next = [...prev];
          next[indexToProcess] = "active";
          return next;
        });
      }, totalInterval / 2);

      currentIndex++;
    }, totalInterval);

    return () => clearInterval(intervalId);
  }, [isInView, t.problems]);

  return (
    <section className={styles.problems} ref={sectionRef}>
      <div className={styles.container}>
        <SectionTitle text={t.title} />
        
        <div className={styles.content}>
          <ul className={styles.list}>
            {t.problems.map((problem: string, index: number) => {
              const status = statuses[index];
              const isActive = status === "active";
              const isGrowing = status === "growing";

              return (
                <li key={index} className={styles.listItem}>
                  <div className={`
                    ${styles.iconWrapper} 
                    ${isGrowing ? styles.growing : ""} 
                    ${isActive ? styles.activeIcon : ""}
                  `}>
                    {isActive ? (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white"/>
                        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#2FB037"/>
                        <path d="M23 12L15 21" stroke="#2FB037" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10 15.5L15 21" stroke="#2FB037" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white"/>
                        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#D0DAE7"/>
                        <path d="M11 11L21 21" stroke="#8395AC" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M21 11L11 21" stroke="#8395AC" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={styles.itemText}>{problem}</span>
                </li>
              );
            })}
          </ul>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTop}>
                <div className={styles.avatarGroup}>
                  <Image src={expertAvatar} alt="Expert" className={styles.avatar} width={36} height={35} />
                  <div className={styles.avatar} />
                  <Image src={expertAvatar} alt="Expert" className={styles.avatar} width={36} height={36} />
                </div>
                <h4 className={styles.cardTitle}>{t.cardTitle}</h4>
              </div>
              <p className={styles.cardDescription}>{t.cardDescription}</p>
            </div>
            
            <Button 
              variant="consultationMobile" 
              className={styles.ctaButton}
            >
              {t.ctaButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
