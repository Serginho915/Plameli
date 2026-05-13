"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { translations } from "./ConsultationHero.translations.ts";
import styles from "./ConsultationHero.module.scss";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs.tsx";
import { BagIcon } from "@/components/ui/Icons/BagIcon/BagIcon.tsx";
import { VerifiedIcon } from "@/components/ui/Icons/VerifiedIcon/VerifiedIcon.tsx";
import { BookingWidget } from "./BookingWidget/BookingWidget.tsx";

// Images
import heroImg from "../../../../../public/images/Consultation/heroConsultattion.jpg";
import discussionImg from "../../../../../public/images/Consultation/discussion.jpg";

export const ConsultationHero = () => {
  const { t } = useTranslation(translations);

  const breadcrumbItems = [
    { label: t.breadcrumbHome, href: "/" },
    { label: t.breadcrumbCurrent },
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Title */}
          <h1 className={styles.title}>{t.title}</h1>

          {/* Quotes Section */}
          <div className={styles.quotesContainer}>
            {/* Row 1 */}
            <div className={`${styles.quoteRow} ${styles.firstRow}`}>
              <div className={styles.imageBox}>
                <Image
                  src={heroImg}
                  alt="Consultation Hero"
                  width={295}
                  height={238}
                  className={styles.mainImage}
                  priority
                />
              </div>
              <div className={styles.textBox}>
                <p>{t.quote1}</p>
                <div className={styles.iconCircle}>
                  <VerifiedIcon />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className={`${styles.quoteRow} ${styles.secondRow}`}>
              <div className={styles.analysisBox}>
                <div className={styles.iconCircle}>
                  <BagIcon />
                </div>
                <p>{t.quote2}</p>
              </div>
              <div className={styles.imageBox}>
                <Image
                  src={discussionImg}
                  alt="Consultation Discussion"
                  width={183}
                  height={128}
                  className={styles.secondaryImage}
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>
              {t.summaryTitleBold}
              {t.summaryTitleRegular}
            </h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <p className={styles.listText}>{t.listItem1}</p>
              </li>
              <li className={styles.listItem}>
                <p className={styles.listText}>{t.listItem2}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <BookingWidget />
        </div>
      </div>
    </section>
  );
};
