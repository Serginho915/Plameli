"use client";

import React from "react";
import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={`${styles.breadcrumbs} ${className || ""}`}>
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
          <span className={styles.separator}></span>
        </div>
      ))}
    </nav>
  );
};
