'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo/Logo';
import { Nav } from './Nav/Nav';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Header.module.scss';
import { Button } from '@/components/ui/Button/Button';
import { Burger } from './Burger/Burger';

export const Header = () => {
  const { language } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href={`/${language}`} className={styles.logo}>
          <Logo />
        </Link>

        <div className={styles.navWrapper}>
          <Nav />
        </div>

        <div className={styles.actions}>
          <Burger
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.burgerBtn}
          />
          <div className={styles.langWrapper}>
            <LanguageSwitcher />
          </div>
          <div className={styles.desktopBtn}>
            <Button
              text='Консультация'
              variant='default'
              className={styles.headerButton}>
              <Link href="#" />
            </Button>
          </div>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileTop}>
            <LanguageSwitcher variant="mobile" />
          </div>
          <Nav />
          <div className={styles.mobileActions}>
            <Button
              text='Консультация'
              variant='consultationMobile'>
              <Link href="#" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
