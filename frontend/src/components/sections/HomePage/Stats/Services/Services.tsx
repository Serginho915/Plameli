"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button/Button.tsx";
import { translations } from "./Services.translations";
import styles from "./Services.module.scss";
import serviceImg from "../../../../../../public/images/Stats/service.svg";
import serviceGreenImg from "../../../../../../public/images/Stats/serviceGreen.svg";

export const Services = () => {
  const { t } = useTranslation(translations);
  const { lang } = useParams();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Statuses: "" (idle), 'growing' (18x18 grey), 'active' (22x22 green)
  const [statuses, setStatuses] = useState<string[]>(() => 
    t.services ? new Array(t.services.length).fill("") : []
  );
  const [prevServicesLength, setPrevServicesLength] = useState(t.services?.length || 0);

  // Sync statuses if services count changes during render
  if (t.services && t.services.length !== prevServicesLength) {
    setPrevServicesLength(t.services.length);
    setStatuses(new Array(t.services.length).fill(""));
  }

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Trigger only once
        }
      },
      { threshold: 0.2 } // Trigger when 20% of section is visible
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

  useEffect(() => {
    // Only start animation if section is in view and statuses are initialized
    if (!isInView || !t.services || statuses.length === 0) return;

    let currentIndex = 0;
    const totalInterval = 900;

    const intervalId = setInterval(() => {
      if (currentIndex >= t.services.length) {
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
  }, [isInView, t.services, statuses.length]);

  return (
    <section className={styles.servicesSection} ref={sectionRef}>
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
