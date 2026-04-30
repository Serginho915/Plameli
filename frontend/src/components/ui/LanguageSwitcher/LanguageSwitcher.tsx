'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { i18n } from '@/i18n-config';
import styles from './LanguageSwitcher.module.scss';

export const LanguageSwitcher = ({ variant = 'default' }: { variant?: 'default' | 'mobile' }) => {
  const { language } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLang: 'ru' | 'bg') => {
    if (language === newLang) return;
    if (!pathname) return;

    const segments = pathname.split('/');
    segments[1] = newLang;
    
    const nextPathname = segments.join('/');
    router.push(nextPathname);
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'ru' ? 'bg' : 'ru');
  };

  if (variant === 'mobile') {
    return (
      <div className={styles.switcher}>
        <button 
          className={`${styles.langBtn} ${language === 'bg' ? styles.active : ''}`}
          onClick={() => changeLanguage('bg')}
        >
          BG
        </button>
        <button 
          className={`${styles.langBtn} ${language === 'ru' ? styles.active : ''}`}
          onClick={() => changeLanguage('ru')}
        >
          RU
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageSwitcherBtn}
    >
      {(language || 'bg').toUpperCase()}
    </button>
  );
};
