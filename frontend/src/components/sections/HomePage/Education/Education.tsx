"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { EducationGroup } from "@/components/ui/EducationGroup/EducationGroup";
import { RegisterModal } from "@/components/ui/RegisterModal/RegisterModal";
import { getMockCourses, getMockWebinars, EducationItem } from "@/components/sections/EducationPage/EducationListing/mockData";
import { translations } from "./Education.translations";
import styles from "./Education.module.scss";

export const Education = () => {
  const { t, language } = useTranslation(translations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);

  const handleSignUpClick = (item: EducationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Retrieve shared mock data
  const mockCourses = getMockCourses(language);
  const mockWebinars = getMockWebinars(language);

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
              onSignUpClick={handleSignUpClick}
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
              onSignUpClick={handleSignUpClick}
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
      
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        language={language}
        t={t}
      />
    </section>
  );
};
