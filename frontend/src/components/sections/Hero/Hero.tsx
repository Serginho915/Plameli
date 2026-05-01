"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./Hero.translations";
import styles from "./Hero.module.scss";
import heroImg from "../../../../public/images/Hero/olenaShopova.png";

import { CircleArrowIcon } from "@/components/ui/Icons/CircleArrowIcon/CircleArrowIcon";

export const Hero = () => {
  const { t } = useTranslation(translations);

  const forbesBannerContent = (
    <div className={styles.forbesBanner}>
      <p>{t.forbesBanner}</p>
      <CircleArrowIcon className={styles.forbesIcon} />
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
    </section>
  );
};
