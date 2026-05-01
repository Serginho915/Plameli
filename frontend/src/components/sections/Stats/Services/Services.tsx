"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button/Button.tsx";
import { translations } from "./Services.translations";
import styles from "./Services.module.scss";
import serviceImg from "../../../../../public/images/Stats/service.svg";

export const Services = () => {
  const { t } = useTranslation(translations);
  const { lang } = useParams();

  return (
    <section className={styles.servicesSection}>
      <div className={styles.serviceList}>
        <h5>{t.servicesTitle}</h5>
        <div className={styles.contentWrapper}>
          <ul className={styles.services}>
            {t.services.map((service: { name: string }, index: number) => (
              <li key={index}>
                <div className={styles.serviceIcon}>
                  <Image
                    src={serviceImg}
                    alt={service.name}
                    width={32}
                    height={32}
                  />
                </div>
                <p>{service.name}</p>
              </li>
            ))}
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
