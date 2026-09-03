"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from "@/hooks/useTranslation";
import { translations, FooterTranslations } from "./Footer.translations";
import { Logo } from "@/components/layout/Header/Logo/Logo";
import styles from './Footer.module.scss';

export const Footer = () => {
  const pathname = usePathname();
  const { t, language } = useTranslation<FooterTranslations>(translations);

  const isAdminRoute = /^\/(ru|bg)\/admin(\/|$)/.test(pathname);

  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.logoBox}>
            <Logo />
          </div>
          
          <div className={styles.content}>
            <div className={styles.linksGroup}>
              <ul className={styles.links}>
                <li className={styles.linkItem}>
                  <Link href={`/${language}/privacy-policy`} className={styles.link}>
                    {t.privacyPolicy}
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href={`/${language}/cookies`} className={styles.link}>
                    {t.cookies}
                  </Link>
                </li>
              </ul>

              <ul className={`${styles.links} ${styles.legalLinks}`}>
                <li className={styles.linkItem}>
                  <Link href={`/${language}/payments-refunds`} className={styles.link}>
                    {t.paymentsRefunds}
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href={`/${language}/terms-of-service`} className={styles.link}>
                    {t.termsOfService}
                  </Link>
                </li>
              </ul>
            </div>
            
            <p className={styles.copyright}>{t.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
