"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { BookingWidget } from "../Hero/BookingWidget/BookingWidget.tsx";
import { translations } from "./GettingReady.translations.ts";
import styles from "./GettingReady.module.scss";

export const GettingReady = () => {
  const { t } = useTranslation(translations);

  return (
    <section className={styles.gettingReady} id="getting-ready">
      <SectionTitle text={t.title} className={styles.sectionTitle} />

      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.contentColumn}>
          <div className={styles.textBlock}>
            <h3 className={styles.subtitle}>{t.subtitle}</h3>

            <div className={styles.list}>
              {/* Item 1 */}
              <div className={styles.listItem}>
                <div className={styles.bullet}>
                  <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
                    <path d="M0.5 3.9707H14M10 7.46887L14 3.9707L10 0.5" stroke="currentColor" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className={styles.itemContent}>{t.items[0]}</p>
              </div>

              {/* Item 2 with highlight header */}
              <div className={styles.listItemContainer}>
                <div className={styles.itemContent}>
                  <strong>{t.highlight}</strong>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.bullet}>
                    <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
                      <path d="M0.5 3.9707H14M10 7.46887L14 3.9707L10 0.5" stroke="currentColor" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className={styles.itemContent}>
                    {t.items[1].replace(t.highlight, "").trim()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decor element */}
          <div className={styles.decor} />
        </div>

        {/* Right Column (Widget) */}
        <div className={styles.widgetWrapper}>
          <BookingWidget />
        </div>
      </div>
    </section>
  );
};
