'use client';
import Link from 'next/link';
import { Logo } from './Logo/Logo';
import { Nav } from './Nav/Nav';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Header.module.scss';
import { Button } from '@/components/ui/Button/Button';

export const Header = () => {
  const { language } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href={`/${language}`} className={styles.logo}>
          <Logo />
        </Link>

        <Nav />

        <div className={styles.actions}>
          <LanguageSwitcher />
          <Button
            text='Консультация'>
            <Link href="#" />
          </Button>
        </div>
      </div>
    </header>
  );
};
