import React from "react";
import Image from "next/image";
import styles from "./StatCard.module.scss";
import { CircleArrowIcon } from "@/components/ui/Icons/CircleArrowIcon/CircleArrowIcon.tsx";

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
  const [isHovered, setIsHovered] = React.useState(false);

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {data.siteLinkText}
          <CircleArrowIcon isParentHovered={isHovered} />
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
