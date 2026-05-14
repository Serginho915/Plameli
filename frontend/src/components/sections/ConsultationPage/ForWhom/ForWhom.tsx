"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { translations } from "./ForWhom.translations";
import styles from "./ForWhom.module.scss";

const iconPaths = [
  "/icons/forWhom/icon1.svg",
  "/icons/forWhom/icon2.svg",
  "/icons/forWhom/icon3.svg",
  "/icons/forWhom/icon4.svg"
];

interface CardItem {
  title: string;
  description: string;
}

export const ForWhom = () => {
  const { t } = useTranslation(translations);

  return (
    <section className={styles.forWhom}>
      <SectionTitle text={t.sectionTitle} className={styles.title} />
      <div className={styles.container}>
        
        <div className={styles.contentGrid}>
          {t.cards.map((card: CardItem, index: number) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconBox}>
                <Image 
                  src={iconPaths[index]} 
                  alt={card.title} 
                  width={24} 
                  height={24} 
                />
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.cardDescription}>
                <span className={styles.arrow}>→</span>
                <span>{card.description}</span>
              </div>
            </div>
          ))}

          <div className={styles.imageBox}>
            <Image 
              src="/images/Consultation/forWhom.png" 
              alt={t.sectionTitle}
              width={341}
              height={502}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
