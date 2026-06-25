"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { EducationGroup } from "@/components/ui/EducationGroup/EducationGroup";
import { RegisterModal } from "@/components/ui/RegisterModal/RegisterModal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { translations } from "./EducationListing.translations";
import { getEducationItems } from "@/lib/services/contentService";
import type { EducationItem } from "@/types/content";
import styles from "./EducationListing.module.scss";
import Image from "next/image";

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
<<<<<<< HEAD
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
=======
  const [activeFilters, setActiveFilters] = useState<Partial<Record<Exclude<FilterType, "all">, string>>>({});
>>>>>>> 27529bf47543a498954ed3977ae4620b1f73eaf4
  
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

  useEffect(() => {
    let isMounted = true;

    const loadEducationItems = async () => {
      try {
        const data = await getEducationItems(language);
        if (isMounted) {
          setEducationItems(data);
        }
      } catch {
        if (isMounted) {
          setEducationItems([]);
        }
      }
    };

    void loadEducationItems();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const handleActiveFilterChange = (filter: FilterType) => {
    if (filter === "all") {
      setActiveFilters({});
      setOpenDropdown(null);
    } else {
      setOpenDropdown(openDropdown === filter ? null : filter);
    }
  };

  const handleOptionSelect = (category: FilterType, value: string) => {
    if (category === "all") return;
    if (value === "all") {
      setActiveFilters((prev) => {
        const next = { ...prev };
        delete next[category as Exclude<FilterType, "all">];
        return next;
      });
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        [category]: value,
      }));
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
    if (key === "all") return null;
    const value = activeFilters[key as Exclude<FilterType, "all">];
    if (!value || value === "all") return null;
    const subFiltersList = getSubFiltersForCategory(key);
    const match = subFiltersList.find((sf) => sf.value === value);
    return match ? match.label : null;
  };

  const courses = useMemo(
    () => educationItems.filter((item) => item.type === "image"),
    [educationItems]
  );
  const webinars = useMemo(
    () => educationItems.filter((item) => item.type === "video"),
    [educationItems]
  );

  // Declarative high-performance filter resolver
  const filterItems = useMemo(() => {
    return <T extends EducationItem>(items: T[]): T[] => {
      if (Object.keys(activeFilters).length === 0) {
        return items;
      }
      return items.filter((item) => {
        return Object.entries(activeFilters).every(([key, value]) => {
          if (!value || value === "all") return true;
          const predicate = filterPredicates[key as Exclude<FilterType, "all">];
          return predicate ? predicate(item, value as string) : true;
        });
      });
    };
  }, [activeFilters]);

  const filteredCourses = useMemo(() => filterItems(courses), [filterItems, courses]);
  const filteredWebinars = useMemo(() => filterItems(webinars), [filterItems, webinars]);

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
              
              const isActivePill = filter.key === "all" 
                ? Object.keys(activeFilters).length === 0 
                : !!activeFilters[filter.key as Exclude<FilterType, "all">];

              return (
                <li key={filter.key} className={styles.filterWrapper}>
                  <button
                    className={`${styles.filterPill} ${
                      isActivePill ? styles.active : ""
                    } ${isDropdownOpen ? styles.dropdownOpen : ""}`}
                    onClick={() => handleActiveFilterChange(filter.key)}
                  >
                    <Image
                      src={filter.iconSrc}
                      alt={filter.label}
                      className={styles.filterIcon}
                      width={22}
                      height={22}
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
                          (sf.value === "all" && !activeFilters[filter.key as Exclude<FilterType, "all">]) ||
                          activeFilters[filter.key as Exclude<FilterType, "all">] === sf.value;
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
          initialLimit={2}
          showMoreLabel={t.showAll}
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
          initialLimit={2}
          showMoreLabel={t.showAll}
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
