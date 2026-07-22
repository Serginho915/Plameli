"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import styles from "./EducationCard.module.scss";

interface MetaItem {
  label: string;
  value: string;
  isPrice?: boolean;
}

interface EducationCardProps {
  title: string;
  type: "video" | "image";
  mediaSrc: string;
  poster?: string;
  meta: MetaItem[];
  learnMoreHref: string;
  signUpHref: string;
  learnMoreLabel: string;
  signUpLabel: string;
  onSignUpClick?: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  title,
  mediaSrc,
  meta,
  learnMoreHref,
  signUpHref,
  learnMoreLabel,
  signUpLabel,
  onSignUpClick,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardMain}>
        <div className={styles.imageWrapper}>
          <Image
            src={mediaSrc}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <div className={styles.metaList}>
            {meta.map((item, index) => (
              <div key={index} className={styles.metaRow}>
                <span className={styles.metaLabel}>{item.label}</span>
                <span
                  className={`${styles.metaValue} ${item.isPrice ? styles.price : ""}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.buttonWrapper}>
          <Link href={learnMoreHref}>
            <Button variant="outline">{learnMoreLabel}</Button>
          </Link>
        </div>
        <div className={styles.buttonWrapper}>
          {onSignUpClick ? (
            <Button variant="filled" onClick={onSignUpClick}>
              {signUpLabel}
            </Button>
          ) : (
            <Link href={signUpHref}>
              <Button variant="filled">{signUpLabel}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
