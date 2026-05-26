"use client";

import React, { useState } from 'react';
import { useTranslation } from "@/hooks/useTranslation.ts";
import { translations, FooterTranslations } from "./Footer.translations.ts";
import { Logo } from "@/components/layout/Header/Logo/Logo.tsx";
import { Modal } from "@/components/ui/Modal/Modal.tsx";
import styles from './Footer.module.scss';

export const Footer = () => {
  const { t } = useTranslation<FooterTranslations>(translations);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className={styles.linkButton}
                  >
                    {t.euProjectInfo}
                  </button>
                </li>
                <li className={styles.linkItem}><a href="#" className={styles.link}>{t.privacyPolicy}</a></li>
                <li className={styles.linkItem}><a href="#" className={styles.link}>{t.cookies}</a></li>
                <li className={styles.linkItem}><a href="#" className={styles.link}>{t.paymentsRefunds}</a></li>
              </ul>
            </div>
            
            <p className={styles.copyright}>{t.copyright}</p>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.documentWrapper}>
          <img 
            src="/Plakat-Plameli-Digi.jpg" 
            alt={t.euProjectInfo}
            className={styles.documentImage}
          />
        </div>
      </Modal>
    </footer>
  );
};
