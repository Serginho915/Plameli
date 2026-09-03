"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { EducationGroup } from "@/components/ui/EducationGroup/EducationGroup";
import { RegisterModal } from "@/components/ui/RegisterModal/RegisterModal";
import { getEducationItems } from "@/lib/services/contentService";
import type { EducationItem } from "@/types/content";
import { translations } from "./Education.translations";
import filterStyles from "@/components/sections/EducationPage/EducationListing/EducationListing.module.scss";
import styles from "./Education.module.scss";

type FilterType = "all" | "level" | "goal" | "format";
type FilterCategory = Exclude<FilterType, "all">;

const filterPredicates: Record<
  FilterCategory,
  (item: EducationItem, value: string) => boolean
> = {
  level: (item, val) => item.level === val,
  goal: (item, val) => item.goal === val,
  format: (item, val) => item.format.toLowerCase() === val.toLowerCase(),
};

const filterIcons: Record<FilterType, string> = {
  all: "/icons/Education/Vector1.svg",
  level: "/icons/Education/vector2.svg",
  goal: "/icons/Education/vector3.svg",
  format: "/icons/Education/Vecto4r.svg",
};

export const Education = () => {
  const { t, language } = useTranslation(translations);
  const [items, setItems] = useState<EducationItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<Partial<Record<FilterCategory, string>>>({});
  const [openDropdown, setOpenDropdown] = useState<FilterType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const filterBarRef = useRef<HTMLUListElement>(null);

  const handleSignUpClick = (item: EducationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleActiveFilterChange = (filter: FilterType) => {
    if (filter === "all") {
      setActiveFilters({});
      setOpenDropdown(null);
      return;
    }

    setOpenDropdown(openDropdown === filter ? null : filter);
  };

  const handleOptionSelect = (category: FilterCategory, value: string) => {
    if (value === "all") {
      setActiveFilters((prev) => {
        const next = { ...prev };
        delete next[category];
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

  const filters: { key: FilterType; label: string; iconSrc: string }[] = [
    { key: "all", label: t.filterAll, iconSrc: filterIcons.all },
    { key: "level", label: t.filterLevel, iconSrc: filterIcons.level },
    { key: "goal", label: t.filterGoal, iconSrc: filterIcons.goal },
    { key: "format", label: t.filterFormat, iconSrc: filterIcons.format },
  ];

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

  const getActiveOptionLabel = (key: FilterCategory) => {
    const value = activeFilters[key];
    if (!value || value === "all") return null;
    const subFiltersList = getSubFiltersForCategory(key);
    const match = subFiltersList.find((sf) => sf.value === value);
    return match ? match.label : null;
  };

  const webinars = useMemo(() => items.filter((item) => item.type === "video"), [items]);
  const courses = useMemo(() => items.filter((item) => item.type === "image"), [items]);

  const filterItems = useMemo(() => {
    return <T extends EducationItem>(educationItems: T[]): T[] => {
      if (Object.keys(activeFilters).length === 0) {
        return educationItems;
      }

      return educationItems.filter((item) =>
        Object.entries(activeFilters).every(([key, value]) => {
          if (!value || value === "all") return true;
          const predicate = filterPredicates[key as FilterCategory];
          return predicate ? predicate(item, value) : true;
        })
      );
    };
  }, [activeFilters]);

  const filteredWebinars = useMemo(() => filterItems(webinars), [filterItems, webinars]);
  const filteredCourses = useMemo(() => filterItems(courses), [filterItems, courses]);

  return (
    <section className={styles.education}>
      <div className={styles.container}>
        <ul className={`${filterStyles.filterBar} ${styles.filterBar}`} ref={filterBarRef}>
          {filters.map((filter) => {
            const categoryKey: FilterCategory | null = filter.key === "all" ? null : filter.key;
            const activeOptionLabel = categoryKey ? getActiveOptionLabel(categoryKey) : null;
            const hasSubfilters = categoryKey !== null;
            const subFiltersList = getSubFiltersForCategory(filter.key);
            const isDropdownOpen = openDropdown === filter.key;
            const isActivePill =
              categoryKey === null
                ? Object.keys(activeFilters).length === 0
                : !!activeFilters[categoryKey];

            return (
              <li key={filter.key} className={filterStyles.filterWrapper}>
                <button
                  className={`${filterStyles.filterPill} ${
                    isActivePill ? filterStyles.active : ""
                  } ${isDropdownOpen ? filterStyles.dropdownOpen : ""}`}
                  onClick={() => handleActiveFilterChange(filter.key)}
                >
                  <Image
                    src={filter.iconSrc}
                    alt={filter.label}
                    className={filterStyles.filterIcon}
                    width={22}
                    height={22}
                  />
                  <span className={filterStyles.filterText}>
                    {activeOptionLabel ? activeOptionLabel : filter.label}
                  </span>
                  {hasSubfilters && (
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className={`${filterStyles.chevron} ${
                        isDropdownOpen ? filterStyles.chevronRotated : ""
                      }`}
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

                {hasSubfilters && isDropdownOpen && categoryKey && (
                  <ul className={filterStyles.dropdownMenu}>
                    {subFiltersList.map((sf) => {
                      const isOptionActive =
                        (sf.value === "all" && !activeFilters[categoryKey]) ||
                        activeFilters[categoryKey] === sf.value;
                      return (
                        <li key={sf.value}>
                          <button
                            className={`${filterStyles.dropdownItem} ${
                              isOptionActive ? filterStyles.itemActive : ""
                            }`}
                            onClick={() => handleOptionSelect(categoryKey, sf.value)}
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

        <div className={styles.grid}>
          {/* Webinars Column */}
          <div className={styles.column}>
            <EducationGroup
              title={t.webinarsTitle}
              items={filteredWebinars}
              variant="homepage"
              limit={2}
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
              items={filteredCourses}
              variant="homepage"
              limit={2}
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
