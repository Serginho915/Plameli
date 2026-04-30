'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo/Logo.tsx';
import { Nav } from './Nav/Nav.tsx';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher.tsx';
import { useTranslation } from '@/hooks/useTranslation.ts';
import styles from './Header.module.scss';
import { Button } from '@/components/ui/Button/Button.tsx';
import { Burger } from './Burger/Burger.tsx';

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
              text='Консультация'>
              <Link href="#" />
            </Button>
          </div>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuContent}>
          <Nav />
          <div className={styles.mobileActions}>
            <LanguageSwitcher />
            <Button
              text='Консультация'>
              <Link href="#" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
