'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { i18n } from '@/i18n-config';
import styles from './LanguageSwitcher.module.scss';

export const LanguageSwitcher = () => {
  const { language } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLanguage = language === 'ru' ? 'bg' : 'ru';
    
    if (!pathname) return;

    const segments = pathname.split('/');
    segments[1] = nextLanguage;
    
    const nextPathname = segments.join('/');
    router.push(nextPathname);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageSwitcherBtn}
      style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, font: 'inherit' }}
    >
      {(language || 'bg').toUpperCase()}
    </button>
  );
};
