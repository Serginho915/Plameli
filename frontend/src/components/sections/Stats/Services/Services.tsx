"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button/Button.tsx";
import { translations } from "./Services.translations";
import styles from "./Services.module.scss";
import serviceImg from "../../../../../public/images/Stats/service.svg";
import serviceGreenImg from "../../../../../public/images/Stats/serviceGreen.svg";

export const Services = () => {
  const { t } = useTranslation(translations);
  const { lang } = useParams();
  
  // Statuses: null (idle), 'growing' (18x18 grey), 'active' (15x15 green)
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (t.services && statuses.length === 0) {
      setStatuses(new Array(t.services.length).fill(""));
    }
  }, [t.services, statuses.length]);

  useEffect(() => {
    if (!t.services || statuses.length === 0) return;

    let currentIndex = 0;
    const totalInterval = 700; // Time between each icon starting its cycle

    const intervalId = setInterval(() => {
      if (currentIndex >= t.services.length) {
        clearInterval(intervalId);
        return;
      }

      const indexToProcess = currentIndex;
      
      // Stage 1: Shrink to 18x18 (grey)
      setStatuses(prev => {
        const next = [...prev];
        next[indexToProcess] = "growing";
        return next;
      });

      // Stage 2: Turn green and shrink to 15x15 after half the interval
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
  }, [t.services, statuses.length]);

  return (
    <section className={styles.servicesSection}>
      <div className={styles.serviceList}>
        <h5>{t.servicesTitle}</h5>
        <div className={styles.contentWrapper}>
          <ul className={styles.services}>
            {t.services.map((service: { name: string }, index: number) => {
              const status = statuses[index];
              const isActive = status === "active";
              const isGrowing = status === "growing";
              
              return (
                <li key={index}>
                  <div className={`
                    ${styles.serviceIcon} 
                    ${isGrowing ? styles.growing : ""} 
                    ${isActive ? styles.activeIcon : ""}
                  `}>
                    <Image
                      src={isActive ? serviceGreenImg : serviceImg}
                      alt={service.name}
                      width={isActive ? 22 : isGrowing ? 18 : 22}
                      height={isActive ? 22 : isGrowing ? 18 : 22}
                    />
                  </div>
                  <p>{service.name}</p>
                </li>
              );
            })}
          </ul>

          <div className={styles.missionBlock}>
            <div className={styles.missionTextBlock}>
              <p>{t.missionText}</p>
            </div>
            <Link href={`/${lang}/consultation`} className={styles.ctaWrapper}>
              <Button variant="consultationMobile" className={styles.ctaButton}>
                {t.missionButton}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
