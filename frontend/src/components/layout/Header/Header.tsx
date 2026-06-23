'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo/Logo';
import { Nav } from './Nav/Nav';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Header.module.scss';
import { Button } from '@/components/ui/Button/Button';
import { Burger } from './Burger/Burger';
import { useUI } from '@/context/UIContext';

export const Header = () => {
  const pathname = usePathname();
  const { language } = useTranslation();
  const { isMenuOpen, setIsMenuOpen } = useUI();
  const headerRef = useRef<HTMLElement>(null);

  const isAdminRoute = /^\/(ru|bg)\/admin(\/|$)/.test(pathname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Use a small timeout to avoid immediate closing when opening the menu
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isMenuOpen, setIsMenuOpen]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className={styles.header} ref={headerRef}>
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
            <Link href={`/${language}/consultation`}>
              <Button
                text='Консультация'
                variant='default'
                className={styles.headerButton}
              />
            </Link>
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
            <Link href={`/${language}/consultation`} className={styles.mobileLink}>
              <Button
                text='Консультация'
                variant='consultationMobile'
                className={styles.headerButton}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
