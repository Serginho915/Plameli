"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./CookieConsent.module.scss";

const GA_MEASUREMENT_ID = "G-WN6PFNNWDN";
const CONSENT_KEY = "ledgerlab.cookieConsent.v1";

type ConsentState = "accepted" | "declined" | "unset" | "pending";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const translations = {
  ru: {
    title: "Cookies и аналитика",
    text: "Мы используем необходимые cookies для работы сайта и Google Analytics, чтобы понимать, какие страницы полезны посетителям. Аналитика включится только после вашего согласия.",
    accept: "Принять",
    decline: "Только необходимые",
    details: "Подробнее",
  },
  bg: {
    title: "Бисквитки и аналитика",
    text: "Използваме необходими бисквитки за работата на сайта и Google Analytics, за да разбираме кои страници са полезни за посетителите. Аналитиката се включва само след вашето съгласие.",
    accept: "Приемам",
    decline: "Само необходими",
    details: "Научете повече",
  },
};

export function CookieConsent() {
  const { t, language } = useTranslation(translations);
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);

  function saveConsent(nextConsent: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, nextConsent);
    window.dispatchEvent(new Event("ledgerlab-cookie-consent"));
  }

  const hasAccepted = consent === "accepted";
  const shouldShowBanner = consent === "unset";

  return (
    <>
      {hasAccepted ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ledgerlab-google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){window.dataLayer.push(arguments);}
window.gtag('js', new Date());
window.gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {shouldShowBanner ? (
        <div className={styles.banner} role="dialog" aria-live="polite" aria-labelledby="cookie-consent-title">
          <div className={styles.content}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>Privacy</p>
              <h2 id="cookie-consent-title" className={styles.title}>
                {t.title}
              </h2>
              <p className={styles.text}>{t.text}</p>
            </div>

            <div className={styles.actions}>
              <Link className={styles.link} href={`/${language}/cookies`}>
                {t.details}
              </Link>
              <button type="button" className={styles.secondaryButton} onClick={() => saveConsent("declined")}>
                {t.decline}
              </button>
              <button type="button" className={styles.primaryButton} onClick={() => saveConsent("accepted")}>
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("ledgerlab-cookie-consent", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("ledgerlab-cookie-consent", onStoreChange);
  };
}

function getConsentSnapshot(): ConsentState {
  const storedConsent = window.localStorage.getItem(CONSENT_KEY);
  return storedConsent === "accepted" || storedConsent === "declined" ? storedConsent : "unset";
}

function getServerConsentSnapshot(): ConsentState {
  return "pending";
}
