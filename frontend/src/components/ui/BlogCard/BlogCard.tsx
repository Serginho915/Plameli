import React from 'react';
import Link from 'next/link';
import { CircleArrowIcon } from '../Icons/CircleArrowIcon/CircleArrowIcon.tsx';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
  authorLabel: string;
  authorName: string;
  title: string;
  readLabel: string;
  href: string;
  className?: string;
}

export const BlogCard = ({ 
  authorLabel, 
  authorName, 
  title, 
  readLabel, 
  href, 
  className 
}: BlogCardProps) => {
  return (
    <Link href={href} className={`${styles.blogCard} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.authorRow}>
          <span className={styles.authorLabel}>{authorLabel}</span>
          <span className={styles.authorName}>{authorName}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.footer}>
        <span className={styles.readLabel}>{readLabel}</span>
        <div className={styles.iconWrapper}>
          <CircleArrowIcon className={styles.icon} />
        </div>
      </div>
    </Link>
  );
};
