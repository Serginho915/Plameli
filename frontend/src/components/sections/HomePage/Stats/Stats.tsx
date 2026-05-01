"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./Stats.translations";
import { StatCard, StatCardData } from "./StatCard/StatCard";
import styles from "./Stats.module.scss";
import serviceImg from "../../../../../public/images/Stats/service.svg";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { Services } from "./Services/Services";

export const Stats = () => {
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

  return (
    <section className={styles.stats}>
        <ul className={styles.statsRow}>
          {statsData.map((stat, index) => (
            <li key={index}>
              <StatCard data={stat} />
            </li>
          ))}
        </ul>

        <Services />
    </section>
  );
};
