"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button.tsx";
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
}

export const EducationCard: React.FC<EducationCardProps> = ({
  title,
  type,
  mediaSrc,
  poster,
  meta,
  learnMoreHref,
  signUpHref,
  learnMoreLabel,
  signUpLabel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardMain}>
        {type === "video" ? (
          <div
            className={styles.videoWrapper}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={mediaSrc}
              poster={poster}
              className={styles.video}
              controls={showControls}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {!isPlaying && (
              <div className={styles.playButton} onClick={handlePlay}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.imageWrapper}>
            <Image
              src={mediaSrc}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

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
          <Link href={signUpHref}>
            <Button variant="filled">{signUpLabel}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
