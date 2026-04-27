'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '../../ui/LanguageSwitcher';
import { translations } from './Header.translations';
import styles from './Header.module.scss';

export const Header = () => {
  const { t } = useTranslation(translations);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          PLAMELI
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/">{t('nav_home')}</Link>
          <Link href="/about">{t('nav_about')}</Link>
          <Link href="/contact">{t('nav_contact')}</Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
