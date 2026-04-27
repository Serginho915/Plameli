'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { translations } from './Footer.translations';
import styles from './Footer.module.scss';

export const Footer = () => {
  const { t } = useTranslation(translations);
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.logo}>
          PLAMELI
        </div>
        
        <div className={styles.copy}>
          © {year} PLAMELI. {t('footer_copy')}
        </div>
      </div>
    </footer>
  );
};
