"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { EducationGroup } from "@/components/ui/EducationGroup/EducationGroup";
import { getEducationItems } from "@/lib/services/contentService";
import type { EducationItem } from "@/types/content";
import { translations } from "./Education.translations";
import styles from "./Education.module.scss";

export const Education = () => {
  const { t, language } = useTranslation(translations);
  const [items, setItems] = useState<EducationItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const data = await getEducationItems(language);
        if (isMounted) {
          setItems(data);
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      }
    };

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const mockWebinars = useMemo(() => items.filter((item) => item.type === "video"), [items]);
  const mockCourses = useMemo(() => items.filter((item) => item.type === "image"), [items]);

  return (
    <section className={styles.education}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Webinars Column */}
          <div className={styles.column}>
            <EducationGroup
              title={t.webinarsTitle}
              items={mockWebinars}
              variant="homepage"
              limit={1}
              viewAllHref={`/${language}/education`}
              viewAllText={t.viewAll}
              language={language}
              learnMoreLabel={t.learnMore}
              signUpLabel={t.signUp}
              startLabel={t.startLabel}
              formatLabel={t.formatLabel}
              priceLabel={t.priceLabel}
            />
          </div>

          {/* Courses Column */}
          <div className={styles.column}>
            <EducationGroup
              title={t.coursesTitle}
              items={mockCourses}
              variant="homepage"
              limit={1}
              viewAllHref={`/${language}/education`}
              viewAllText={t.viewAll}
              language={language}
              learnMoreLabel={t.learnMore}
              signUpLabel={t.signUp}
              startLabel={t.startLabel}
              formatLabel={t.formatLabel}
              priceLabel={t.priceLabel}
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
