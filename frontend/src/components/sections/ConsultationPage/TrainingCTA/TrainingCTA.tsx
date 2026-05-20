"use client";

import React from "react";
import Image from "next/image";
import styles from "./TrainingCTA.module.scss";
import { ActionLink } from "@/components/ui/ActionLink/ActionLink.tsx";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./TrainingCTA.translations";

export const TrainingCTA = () => {
  const { t } = useTranslation(translations);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.contentColumn}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>{t.title}</h2>
              <p className={styles.subtitle}>{t.subtitle}</p>
            </div>
            
            <div className={styles.actionsContent}>
              <ActionLink href="/education" text={t.btnText} variant="outline" />
              
              <div className={styles.featuresList}>
                {t.features.map((feature: any, index: number) => (
                  <div key={index} className={styles.featureItem}>
                    <div className={styles.iconWrapper}>
                      {feature.iconType === 'black' && (
                        <Image src="/icons/TrainingCTA/Vector1.svg" alt="" width={16} height={16} />
                      )}
                      {feature.iconType === 'orange' && (
                        <Image src="/icons/TrainingCTA/Vector2.svg" alt="" width={24} height={24} />
                      )}
                      {feature.iconType === 'black-large' && (
                        <Image src="/icons/TrainingCTA/Vector3.svg" alt="" width={24} height={24} />
                      )}
                    </div>
                    <span className={styles.featureText}>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.imageColumn}>
            <Image 
              src="/images/Consultation/TrainingCTA.png"
              alt="Training CTA"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 347px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
