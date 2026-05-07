"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { Button } from "@/components/ui/Button/Button.tsx";
import { Logo } from "@/components/layout/Header/Logo/Logo.tsx";
import { translations, FeedbackTranslations } from "./Feedback.translations.ts";
import styles from "./Feedback.module.scss";

export const Feedback = () => {
  const { t } = useTranslation<FeedbackTranslations>(translations);

  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="14" fill="currentColor"/>
          <path d="M15.5 20V13.5H17.5L17.8 11H15.5V9.5C15.5 8.8 15.7 8.3 16.7 8.3H18V6.1C17.7 6.1 16.8 6 15.8 6C13.5 6 12 7.4 12 9.9V11H10V13.5H12V20H15.5Z" fill="white"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "#",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="14" fill="currentColor"/>
          <path d="M7 10H10V19H7V10ZM8.5 5.5C9.5 5.5 10.2 6.3 10.2 7.2C10.2 8.1 9.5 8.9 8.5 8.9C7.5 8.9 6.8 8.1 6.8 7.2C6.8 6.3 7.5 5.5 8.5 5.5ZM11.5 10H14.5V11.2C15 10.5 16 9.8 17.5 9.8C19.8 9.8 21 11.2 21 13.8V19H18V14.5C18 12.8 17.8 12.2 16.8 12.2C15.8 12.2 15.2 13 15.2 14.5V19H11.5V10Z" fill="white"/>
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "#",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="14" fill="currentColor"/>
          <path d="M21 10.5C21 10.5 21 8.5 14 8.5C7 8.5 7 10.5 7 10.5C7 10.5 6.5 10.5 6.5 14C6.5 17.5 7 17.5 7 17.5C7 17.5 7 19.5 14 19.5C21 19.5 21 17.5 21 17.5C21 17.5 21.5 17.5 21.5 14C21.5 10.5 21 10.5 21 10.5ZM12.5 16.5V11.5L16.5 14L12.5 16.5Z" fill="white"/>
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "#",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="14" fill="currentColor"/>
          <path d="M14 9.1C11.3 9.1 9.1 11.3 9.1 14C9.1 16.7 11.3 18.9 14 18.9C16.7 18.9 18.9 16.7 18.9 14C18.9 11.3 16.7 9.1 14 9.1ZM14 17.15C12.25 17.15 10.85 15.75 10.85 14C10.85 12.25 12.25 10.85 14 10.85C15.75 10.85 17.15 12.25 17.15 14C17.15 15.75 15.75 17.15 14 17.15Z" fill="white"/>
          <path d="M18.9 5.6H9.1C7.15 5.6 5.6 7.15 5.6 9.1V18.9C5.6 20.85 7.15 22.4 9.1 22.4H18.9C20.85 22.4 22.4 20.85 22.4 18.9V9.1C22.4 7.15 20.85 5.6 18.9 5.6ZM20.65 18.9C20.65 19.85 19.85 20.65 18.9 20.65H9.1C8.15 20.65 7.35 19.85 7.35 18.9V9.1C7.35 8.15 8.15 7.35 9.1 7.35H18.9C19.85 7.35 20.65 8.15 20.65 9.1V18.9Z" fill="white"/>
          <circle cx="18.9" cy="9.1" r="1.05" fill="white"/>
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.feedback} id="contacts">
      <SectionTitle text={t.title} className={styles.sectionTitle} />

      <div className={styles.wrapper}>
        {/* Left Column: Contacts */}
        <div className={styles.leftColumn}>
          <h3 className={styles.contactsTitle}>{t.contactsTitle}</h3>

          <ul className={styles.contactList}>
            <li className={styles.contactItemWrapper}>
              <a
                href="https://t.me/OlenaShopovaManager"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <div className={styles.iconBox}>
                  <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701-.331 4.955c.488 0 .702-.223.974-.488l2.338-2.273 4.861 3.59c.896.495 1.541.239 1.764-.834l3.195-15.04c.327-1.31-.5-1.905-1.354-1.528z" fill="currentColor" />
                  </svg>
                </div>
                <span className={styles.contactText}>{t.telegram}</span>
              </a>
            </li>

            <li className={styles.contactItemWrapper}>
              <a href={`mailto:${t.email}`} className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className={styles.contactText}>{t.email}</span>
              </a>
            </li>

            <li className={styles.contactItemWrapper}>
              <div className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className={styles.contactText}>{t.location}</span>
              </div>
            </li>
          </ul>

          <ul className={styles.socialsRow}>
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  className={styles.socialBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <div className={styles.socialIcon}>{social.icon}</div>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.consultationBtnWrapper}>
            <Button variant="primaryOutline" className={styles.consultationBtn}>
              <span className={styles.desktopText}>{t.consultationBtn}</span>
              <span className={styles.mobileText}>{t.consultationBtnMobile}</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={styles.rightSide}>
          <div className={styles.formBlock}>
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>{t.formTitle}</h3>
              <p className={styles.formSubtitle}>{t.formSubtitle}</p>
            </div>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputsStack}>
                <input type="text" placeholder={t.formNamePlaceholder} className={styles.inputField} />
                <input type="email" placeholder={t.formEmailPlaceholder} className={styles.inputField} />
                <textarea placeholder={t.formQuestionPlaceholder} className={styles.textareaField} />
              </div>

              <Button type="submit" variant="outline" className={styles.submitBtn}>
                {t.formSubmitBtn}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
