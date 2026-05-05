"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button/Button";
import { CircleArrowIcon } from "@/components/ui/Icons/CircleArrowIcon/CircleArrowIcon";
import { EducationCard } from "@/components/ui/EducationCard/EducationCard";
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

            <EducationCard
              title={t.webinarTitle}
              type="video"
              mediaSrc="https://vjs.zencdn.net/v/oceans.mp4"
              poster="/images/Education/webinar.png"
              meta={[
                { label: t.startLabel, value: t.webinarDate },
                { label: t.formatLabel, value: t.webinarFormat },
                { label: t.priceLabel, value: t.webinarPrice, isPrice: true },
              ]}
              learnMoreHref={`/${lang}/webinars/1`}
              signUpHref={`/${lang}/webinars/1#form`}
              learnMoreLabel={t.learnMore}
              signUpLabel={t.signUp}
            />
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

            <EducationCard
              title={t.courseTitle}
              type="image"
              mediaSrc="/images/Education/course.png"
              meta={[
                { label: t.startLabel, value: t.courseDuration },
                { label: t.formatLabel, value: t.courseFormat },
                { label: t.priceLabel, value: t.coursePrice, isPrice: true },
              ]}
              learnMoreHref={`/${lang}/courses/1`}
              signUpHref={`/${lang}/courses/1#form`}
              learnMoreLabel={t.learnMore}
              signUpLabel={t.signUp}
            />
          </div>
        </div>
        <div className={styles.helpText}>
          {t.helpText}
          <Link href="#form">
            <strong>{t.onlineForm}</strong>
          </Link>
        </div>
      </div>
    </section>
  );
};
