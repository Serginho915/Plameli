"use client";

import React, { useState, useRef } from "react";
import { ActionLink } from "@/components/ui/ActionLink/ActionLink";
import { EducationCard } from "@/components/ui/EducationCard/EducationCard";
import { EducationItem } from "@/components/sections/EducationPage/EducationListing/mockData";
import styles from "./EducationGroup.module.scss";

export interface EducationGroupProps {
  title: string;
  items: EducationItem[];
  variant: "homepage" | "listing";
  /** Hard cap — applies always and overrides expand logic */
  limit?: number;
  /** Initial number of cards shown before "show all" is clicked */
  initialLimit?: number;
  /** Label for the "show all" expand button */
  showMoreLabel?: string;
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
  initialLimit,
  showMoreLabel,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);

  // 1. Apply hard limit first (homepage carousel cap, etc.)
  const cappedItems = limit ? items.slice(0, limit) : items;

  // 2. Apply initial/expand limit when not yet expanded
  const displayedItems =
    initialLimit && !isExpanded
      ? cappedItems.slice(0, initialLimit)
      : cappedItems;

  // Show the "Показать все" button only if there are hidden items
  const hasMore = initialLimit ? cappedItems.length > initialLimit : false;

  const isHomepage = variant === "homepage";

  const handleToggleExpand = () => {
    if (isExpanded && groupRef.current) {
      // Smoothly scroll back to the start of this block with an offset for the header
      const y = groupRef.current.getBoundingClientRect().top + window.scrollY - 100;
      setTimeout(() => {
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 0);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={groupRef} className={`${styles.group} ${isHomepage ? styles.homepage : styles.listing}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllHref && viewAllText && (
          <ActionLink
            href={viewAllHref}
            text={viewAllText}
            variant="outline"
            className={styles.viewAll}
            hideTextOnMobile={true}
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

      {/* Expand button — only visible when there are hidden items */}
      {hasMore && (
        <button
          className={styles.showMoreBtn}
          onClick={handleToggleExpand}
          aria-label={showMoreLabel || "Показать все"}
        >
          <div className={styles.orangeLine} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="11"
            viewBox="0 0 19 11"
            fill="none"
            className={`${styles.chevronIcon} ${isExpanded ? styles.chevronRotated : ""}`}
          >
            <path
              d="M9.48828 7.71337L16.8383 0.363372C17.0883 0.113372 17.3843 -0.00762791 17.7263 0.000372093C18.0683 0.00837209 18.3639 0.137705 18.6133 0.388372C18.8626 0.639039 18.9876 0.935039 18.9883 1.27637C18.9889 1.61771 18.8639 1.91337 18.6133 2.16337L10.9133 9.83837C10.7133 10.0384 10.4883 10.1884 10.2383 10.2884C9.98828 10.3884 9.73828 10.4384 9.48828 10.4384C9.23828 10.4384 8.98828 10.3884 8.73828 10.2884C8.48828 10.1884 8.26328 10.0384 8.06328 9.83837L0.363279 2.13837C0.113279 1.88837 -0.00772095 1.5967 0.000278473 1.26337C0.00827789 0.930038 0.137611 0.638372 0.388279 0.388372C0.638947 0.138372 0.934946 0.0133721 1.27628 0.0133721C1.61761 0.0133721 1.91328 0.138372 2.16328 0.388372L9.48828 7.71337Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
