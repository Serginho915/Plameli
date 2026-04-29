import React from "react";
import Image from "next/image";
import styles from "./StatCard.module.scss";

export interface StatCardData {
  type: "stat" | "site";
  value?: string;
  label?: string;
  siteName?: string;
  siteLink?: string;
  siteLinkText?: string;
  siteLogo?: string;
}

interface StatCardProps {
  data: StatCardData;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  if (data.type === "site") {
    return (
      <div className={`${styles.statCard} ${styles.siteCard}`}>
        <div className={styles.siteTop}>
          {data.siteLogo && (
            <Image
              src={data.siteLogo}
              alt="Site logo"
              width={28}
              height={36}
              className={styles.siteLogo}
            />
          )}
          <span className={styles.siteName}>{data.siteName}</span>
        </div>
        <a
          href={data.siteLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.siteLink}
        >
          {data.siteLinkText}
          <span className={styles.siteLinkIcon}>
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
        </a>
      </div>
    );
  }

  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{data.value}</span>
      <p className={styles.statLabel}>{data.label}</p>
    </div>
  );
};
