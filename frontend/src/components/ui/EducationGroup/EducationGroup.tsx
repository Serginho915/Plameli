"use client";

import React from "react";
import { ActionLink } from "@/components/ui/ActionLink/ActionLink.tsx";
import { EducationCard } from "@/components/ui/EducationCard/EducationCard.tsx";
import { EducationItem } from "@/components/sections/EducationPage/EducationListing/mockData.ts";
import styles from "./EducationGroup.module.scss";

export interface EducationGroupProps {
  title: string;
  items: EducationItem[];
  variant: "homepage" | "listing";
  limit?: number;
  viewAllHref?: string;
  viewAllText?: string;
  learnMoreLabel: string;
  signUpLabel: string;
  startLabel: string;
  formatLabel: string;
  priceLabel: string;
  language: string;
  onSignUpClick?: (item: EducationItem) => void;
}

export const EducationGroup: React.FC<EducationGroupProps> = ({
  title,
  items,
  variant,
  limit,
  viewAllHref,
  viewAllText,
  learnMoreLabel,
  signUpLabel,
  startLabel,
  formatLabel,
  priceLabel,
  language,
  onSignUpClick,
}) => {
  // Apply limit if specified
  const displayedItems = limit ? items.slice(0, limit) : items;

  const isHomepage = variant === "homepage";

  return (
    <div className={`${styles.group} ${isHomepage ? styles.homepage : styles.listing}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllHref && viewAllText && (
          <ActionLink
            href={viewAllHref}
            text={viewAllText}
            variant="outline"
            className={styles.viewAll}
          />
        )}
      </div>

      {/* Cards Grid */}
      {displayedItems.length > 0 ? (
        <div className={styles.cardsGrid}>
          {displayedItems.map((item) => (
            <div key={item.id} className={styles.cardWrapper}>
              <EducationCard
                title={item.title}
                type={item.type}
                mediaSrc={item.mediaSrc}
                poster={item.type === "video" ? item.poster : undefined}
                meta={[
                  { label: startLabel, value: item.startDate },
                  { label: formatLabel, value: item.format },
                  { label: priceLabel, value: item.price, isPrice: true },
                ]}
                learnMoreHref={`/${language}/education/${item.slug}`}
                signUpHref={`/${language}/education/${item.slug}#register`}
                learnMoreLabel={learnMoreLabel}
                signUpLabel={signUpLabel}
                onSignUpClick={onSignUpClick ? () => onSignUpClick(item) : undefined}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          {language === "ru" ? "Нет доступных материалов" : "Няма налични материали"}
        </div>
      )}
    </div>
  );
};
