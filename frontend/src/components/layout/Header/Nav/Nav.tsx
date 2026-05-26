'use client';
import React, { useState, useRef, useEffect } from 'react'
import styles from './Nav.module.scss'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation.ts'
import { useUI } from '@/context/UIContext.tsx'
import { translations } from './translations.ts'

export const Nav = () => {
  const { t, language } = useTranslation(translations);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsMenuOpen } = useUI();
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);

    const isHomepage =
      window.location.pathname === `/${language}` ||
      window.location.pathname === `/${language}/` ||
      window.location.pathname === '/' ||
      window.location.pathname === '';

    if (isHomepage) {
      const element = document.getElementById(anchor);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `#${anchor}`);
      }
    }
  };

  return (
    <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem} ref={dropdownRef}>
            <button
              className={`${styles.navLink} ${styles.noArrow} ${isDropdownOpen ? styles.navLinkActive : ''}`}
              onClick={() => setIsDropdownOpen(prev => !prev)}
              aria-expanded={isDropdownOpen}
            >
              {t.nav_about_expert}
              <svg
                width="10" height="6" viewBox="0 0 10 6" fill="none"
                className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}
              >
                <path d="M1 1L5 5L9 1" stroke="#404E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className={styles.dropdown}>
                {t.dropdown_items.map((item: { label: string; anchor: string }) => (
                  <li key={item.anchor} className={styles.dropdownItem}>
                    <Link
                      href={`/${language}#${item.anchor}`}
                      className={styles.dropdownLink}
                      onClick={(e) => handleLinkClick(e, item.anchor)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className={styles.navItem}>
            <Link href={`/${language}/education`} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              {t.nav_education}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href={`/${language}#blog`}
              className={styles.navLink}
              onClick={(e) => handleLinkClick(e, 'blog')}
            >
              {t.nav_blog}
            </Link>
          </li>
        </ul>
    </nav>
  )
}
