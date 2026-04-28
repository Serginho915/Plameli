"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./Hero.translations";
import styles from "./Hero.module.scss";

export const Hero = () => {
  const { t } = useTranslation(translations);

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.titles}>
            <h1>{t.title}</h1>
            <h2>{t.subtitle}</h2>
          </div>
          <p>{t.description}</p>
          <div className={styles.actions}>
            <p>{t.actionDescription}</p>
            <button className={styles.btn}>{t.cta}</button>
          </div>
        </div>
      </div>
    </section>
  );
};
