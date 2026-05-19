"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { EducationGroup } from "@/components/ui/EducationGroup/EducationGroup.tsx";
import { RegisterModal } from "@/components/ui/RegisterModal/RegisterModal.tsx";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs.tsx";
import { translations } from "./EducationListing.translations.ts";
import { getMockCourses, getMockWebinars, EducationItem } from "./mockData.ts";
import styles from "./EducationListing.module.scss";

type FilterType = "all" | "level" | "goal" | "format";

// Declarative matching strategy to avoid nested if statements
const filterPredicates: Record<
  Exclude<FilterType, "all">,
  (item: EducationItem, value: string) => boolean
> = {
  level: (item, val) => item.level === val,
  goal: (item, val) => item.goal === val,
  format: (item, val) => item.format.toLowerCase() === val.toLowerCase(),
};

// Filter icon paths from the public directory
const filterIcons: Record<FilterType, string> = {
  all: "/icons/education/Vector1.svg",
  level: "/icons/education/vector2.svg",
  goal: "/icons/education/vector3.svg",
  format: "/icons/education/Vecto4r.svg",
};

export const EducationListing = () => {
  const { t, language } = useTranslation(translations);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [subFilter, setSubFilter] = useState<string>("all");
  
  // Manage open dropdown category state
  const [openDropdown, setOpenDropdown] = useState<FilterType | null>(null);

  // Modal state for course registration
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterBarRef = useRef<HTMLUListElement>(null);

  // Click outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActiveFilterChange = (filter: FilterType) => {
    if (filter === "all") {
      setActiveFilter("all");
      setSubFilter("all");
      setOpenDropdown(null);
    } else {
      setOpenDropdown(openDropdown === filter ? null : filter);
    }
  };

  const handleOptionSelect = (category: FilterType, value: string) => {
    if (value === "all") {
      setActiveFilter("all");
      setSubFilter("all");
    } else {
      setActiveFilter(category);
      setSubFilter(value);
    }
    setOpenDropdown(null);
  };

  const handleSignUpClick = (item: EducationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const filters: { key: FilterType; label: string; iconSrc: string }[] = [
    { key: "all", label: t.filterAll, iconSrc: filterIcons.all },
    { key: "level", label: t.filterLevel, iconSrc: filterIcons.level },
    { key: "goal", label: t.filterGoal, iconSrc: filterIcons.goal },
    { key: "format", label: t.filterFormat, iconSrc: filterIcons.format },
  ];

  // Helper to fetch subfilters dynamically per category
  const getSubFiltersForCategory = (category: FilterType) => {
    if (category === "level") {
      return [
        { value: "all", label: t.levelAll },
        { value: "beginner", label: t.levelBeginner },
        { value: "experienced", label: t.levelExperienced },
        { value: "business", label: t.levelBusiness },
      ];
    }
    if (category === "goal") {
      return [
        { value: "all", label: t.goalAll },
        { value: "launch", label: t.goalLaunch },
        { value: "taxes", label: t.goalTaxes },
        { value: "profession", label: t.goalProfession },
        { value: "optimization", label: t.goalOptimization },
      ];
    }
    if (category === "format") {
      return [
        { value: "all", label: t.formatAll },
        { value: "Online", label: t.formatOnline },
        { value: "Live", label: t.formatLive },
        { value: "Offline", label: t.formatOffline },
      ];
    }
    return [];
  };

  // Helper to fetch selected sub-filter text label for display on the active pill
  const getActiveOptionLabel = (key: FilterType) => {
    if (activeFilter !== key || subFilter === "all") return null;
    const subFiltersList = getSubFiltersForCategory(key);
    const match = subFiltersList.find((sf) => sf.value === subFilter);
    return match ? match.label : null;
  };

  // Retrieve localized mock courses and webinars
  const mockCourses = useMemo(() => getMockCourses(language), [language]);
  const mockWebinars = useMemo(() => getMockWebinars(language), [language]);

  // Declarative high-performance filter resolver
  const filterItems = useMemo(() => {
    return <T extends EducationItem>(items: T[]): T[] => {
      if (activeFilter === "all" || subFilter === "all") {
        return items;
      }
      const predicate = filterPredicates[activeFilter];
      return predicate ? items.filter((item) => predicate(item, subFilter)) : items;
    };
  }, [activeFilter, subFilter]);

  const filteredCourses = useMemo(() => filterItems(mockCourses), [filterItems, mockCourses]);
  const filteredWebinars = useMemo(() => filterItems(mockWebinars), [filterItems, mockWebinars]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: `/${language}` },
            { label: t.breadcrumbEducation },
          ]}
          className={styles.breadcrumbs}
        />

        {/* Header row: description + filters */}
        <div className={styles.headerRow}>
          <div className={styles.description}>
            <p className={styles.descriptionText}>
              <span className={styles.descriptionGrey}>{t.descriptionGrey}</span>
              <span className={styles.descriptionBold}>{t.descriptionBold}</span>
            </p>
          </div>

          <ul className={styles.filterBar} ref={filterBarRef}>
            {filters.map((filter) => {
              const activeOptionLabel = getActiveOptionLabel(filter.key);
              const hasSubfilters = filter.key !== "all";
              const subFiltersList = getSubFiltersForCategory(filter.key);
              const isDropdownOpen = openDropdown === filter.key;

              return (
                <li key={filter.key} className={styles.filterWrapper}>
                  <button
                    className={`${styles.filterPill} ${
                      activeFilter === filter.key ? styles.active : ""
                    } ${isDropdownOpen ? styles.dropdownOpen : ""}`}
                    onClick={() => handleActiveFilterChange(filter.key)}
                  >
                    <img
                      src={filter.iconSrc}
                      alt=""
                      className={styles.filterIcon}
                    />
                    <span className={styles.filterText}>
                      {activeOptionLabel ? activeOptionLabel : filter.label}
                    </span>
                    {hasSubfilters && (
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        className={`${styles.chevron} ${isDropdownOpen ? styles.chevronRotated : ""}`}
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown Menu Container */}
                  {hasSubfilters && isDropdownOpen && (
                    <ul className={styles.dropdownMenu}>
                      {subFiltersList.map((sf) => {
                        const isOptionActive =
                          activeFilter === filter.key && subFilter === sf.value;
                        return (
                          <li key={sf.value}>
                            <button
                              className={`${styles.dropdownItem} ${
                                isOptionActive ? styles.itemActive : ""
                              }`}
                              onClick={() => handleOptionSelect(filter.key, sf.value)}
                            >
                              {sf.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Courses Section */}
        <EducationGroup
          title={t.coursesTitle}
          items={filteredCourses}
          variant="listing"
          language={language}
          learnMoreLabel={t.learnMore}
          signUpLabel={t.signUp}
          startLabel={t.startLabel}
          formatLabel={t.formatLabel}
          priceLabel={t.priceLabel}
          onSignUpClick={handleSignUpClick}
        />

        {/* Webinars Section */}
        <EducationGroup
          title={t.webinarsTitle}
          items={filteredWebinars}
          variant="listing"
          language={language}
          learnMoreLabel={t.learnMore}
          signUpLabel={t.signUp}
          startLabel={t.startLabel}
          formatLabel={t.formatLabel}
          priceLabel={t.priceLabel}
          onSignUpClick={handleSignUpClick}
        />
      </div>

      {/* Registration Modal Form pop-up */}
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
