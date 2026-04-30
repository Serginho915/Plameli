'use client';
import React from 'react'
import styles from './Nav.module.scss'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation.ts'
import { translations } from './translations.ts'

export const Nav = () => {
  const { t, language } = useTranslation(translations);

  return (
    <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href={`/${language}/about`} className={styles.navLink}>
              {t.nav_about_expert}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={styles.chevron}>
                <path d="M1 1L5 5L9 1" stroke="#404E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href={`/${language}/education`} className={styles.navLink}>
              {t.nav_education}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href={`/${language}/blog`} className={styles.navLink}>
              {t.nav_blog}
            </Link>
          </li>
        </ul>
    </nav>
  )
}
