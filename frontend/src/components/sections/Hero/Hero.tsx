"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./Hero.translations";
import { StatCard, StatCardData } from "./StatCard/StatCard";
import styles from "./Hero.module.scss";
import heroImg from "../../../../public/images/Hero/olenaShopova.png";

export const Hero = () => {
  const { t } = useTranslation(translations);

  const statsData: StatCardData[] = [
    { type: "stat", value: t.stat1Value, label: t.stat1Label },
    { type: "stat", value: t.stat2Value, label: t.stat2Label },
    { type: "stat", value: t.stat3Value, label: t.stat3Label },
    {
      type: "site",
      siteName: t.siteName,
      siteLink: "https://plameli.com",
      siteLinkText: t.siteLink,
      siteLogo: "/images/logo.svg",
    },
  ];

  const forbesBannerContent = (
    <div className={styles.forbesBanner}>
      <p>{t.forbesBanner}</p>
      <span className={styles.forbesIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 15L15 5M15 5H8M15 5V12"
            stroke="#697B91"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );

  return (
    <section className={styles.hero}>
      {/* Top section: text + image */}
      <div className={styles.top}>
        <div className={styles.textBlock}>
          <div className={styles.titles}>
            <h1>{t.title}</h1>
            <h2 className={styles.subtitle}>{t.subtitle}</h2>
          </div>
          <p className={styles.description}>{t.description}</p>

          {/* Forbes banner — visible only on desktop */}
          <div className={styles.forbesBannerDesktop}>
            {forbesBannerContent}
          </div>
        </div>

        <div className={styles.imageBlock}>
          <Image
            src={heroImg}
            alt="Hero Image"
            width={406}
            height={365}
            priority
            className={styles.heroImage}
          />
          {/* Forbes banner — overlay ONLY on tablet */}
          <div className={styles.forbesBannerTablet}>
            {forbesBannerContent}
          </div>
        </div>

        {/* Forbes banner — flow element ONLY on mobile */}
        <div className={styles.forbesBannerMobile}>
          {forbesBannerContent}
        </div>
      </div>

      {/* Stats row as a semantic list */}
      <ul className={styles.statsRow}>
        {statsData.map((stat, index) => (
          <li key={index}>
            <StatCard data={stat} />
          </li>
        ))}
      </ul>
    </section>
  );
};
