'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation.ts';
import { i18n } from '@/i18n-config.ts';
import styles from './LanguageSwitcher.module.scss';

export const LanguageSwitcher = ({ variant = 'default' }: { variant?: 'default' | 'mobile' }) => {
  const { language } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [displayLang, setDisplayLang] = useState(language);
  const [prevLanguage, setPrevLanguage] = useState(language);

  if (language !== prevLanguage) {
    setPrevLanguage(language);
    setDisplayLang(language);
  }

  const changeLanguage = (newLang: 'ru' | 'bg') => {
    if (language === newLang) return;
    if (!pathname) return;

    setDisplayLang(newLang);

    setTimeout(() => {
      const segments = pathname.split('/');
      segments[1] = newLang;
      
      const nextPathname = segments.join('/');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('keepMenuOpen', 'true');
      }
      router.push(nextPathname);
    }, 300);
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'ru' ? 'bg' : 'ru');
  };

  if (variant === 'mobile') {
    return (
      <div className={styles.switcher}>
        <div 
          className={styles.slider} 
          style={{ 
            transform: `translateX(${displayLang === 'ru' ? '100%' : '0%'})` 
          }} 
        />
        <button 
          className={`${styles.langBtn} ${displayLang === 'bg' ? styles.active : ''}`}
          onClick={() => changeLanguage('bg')}
        >
          BG
        </button>
        <button 
          className={`${styles.langBtn} ${displayLang === 'ru' ? styles.active : ''}`}
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
