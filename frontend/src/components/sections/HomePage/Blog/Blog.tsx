"use client";

import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle.tsx';
import { BlogCarousel } from './BlogCarousel/BlogCarousel.tsx';
import { translations, BlogTranslations } from './Blog.translations.ts';
import { useTranslation } from '@/hooks/useTranslation.ts';
import styles from './Blog.module.scss';

export const Blog = () => {
  const { t, language } = useTranslation<BlogTranslations>(translations);
  const items = t.items || [];

  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />
        <BlogCarousel items={items} t={t} language={language} />
      </div>
    </section>
  );
};
