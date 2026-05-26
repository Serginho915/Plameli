"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle';
import { translations, BlogTranslations } from './Blog.translations';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Blog.module.scss';

const BlogCarousel = dynamic(
  () => import('./BlogCarousel/BlogCarousel').then((m) => m.BlogCarousel),
  { ssr: false }
);

export const Blog = () => {
  const { t, language } = useTranslation<BlogTranslations>(translations);
  const items = t.items || [];

  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />
        <BlogCarousel items={items} t={t} language={language} />
      </div>
    </section>
  );
};
