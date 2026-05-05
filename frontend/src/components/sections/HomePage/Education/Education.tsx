"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button/Button";
import { CircleArrowIcon } from "@/components/ui/Icons/CircleArrowIcon/CircleArrowIcon";
import { translations } from "./Education.translations";
import styles from "./Education.module.scss";

export const Education = () => {
  const { t, lang } = useTranslation(translations);

  return (
    <section className={styles.education}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Webinars Column */}
          <div className={styles.column}>
            <div className={styles.header}>
              <h2 className={styles.title}>{t.webinarsTitle}</h2>
              <Link href={`/${lang}/webinars`} className={styles.viewAll}>
                <span>{t.viewAll}</span>
                <CircleArrowIcon className={styles.viewAllIcon} />
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src="/images/Education/webinar.png" 
                    alt={t.webinarTitle}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{t.webinarTitle}</h3>
                  <div className={styles.metaList}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.startLabel}</span>
                      <span className={styles.metaValue}>{t.webinarDate}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.formatLabel}</span>
                      <span className={styles.metaValue}>{t.webinarFormat}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.priceLabel}</span>
                      <span className={`${styles.metaValue} ${styles.price}`}>{t.webinarPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <div className={styles.buttonWrapper}>
                  <Link href={`/${lang}/webinars/1`}>
                    <Button variant="outline">{t.learnMore}</Button>
                  </Link>
                </div>
                <div className={styles.buttonWrapper}>
                  <Link href={`/${lang}/webinars/1#form`}>
                    <Button variant="filled">{t.signUp}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Column */}
          <div className={styles.column}>
            <div className={styles.header}>
              <h2 className={styles.title}>{t.coursesTitle}</h2>
              <Link href={`/${lang}/courses`} className={styles.viewAll}>
                <span>{t.viewAll}</span>
                <CircleArrowIcon className={styles.viewAllIcon} />
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src="/images/Education/course.png" 
                    alt={t.courseTitle}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{t.courseTitle}</h3>
                  <div className={styles.metaList}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.startLabel}</span>
                      <span className={styles.metaValue}>{t.courseDuration}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.formatLabel}</span>
                      <span className={styles.metaValue}>{t.courseFormat}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.priceLabel}</span>
                      <span className={`${styles.metaValue} ${styles.price}`}>{t.coursePrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <div className={styles.buttonWrapper}>
                  <Link href={`/${lang}/courses/1`}>
                    <Button variant="outline">{t.learnMore}</Button>
                  </Link>
                </div>
                <div className={styles.buttonWrapper}>
                  <Link href={`/${lang}/courses/1#form`}>
                    <Button variant="filled">{t.signUp}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
