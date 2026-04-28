'use client';
import React from 'react'
import styles from './Nav.module.scss'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { translations } from './translations'

export const Nav = () => {
  const { t, language } = useTranslation(translations);

  return (
    <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href={`/${language}/about`} className={styles.navLink}>
              {t.nav_about_expert}
              <span className={styles.arrow}></span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href={`/${language}/education`}>
              {t.nav_education}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href={`/${language}/blog`}>
              {t.nav_blog}
            </Link>
          </li>
        </ul>
    </nav>
  )
}
