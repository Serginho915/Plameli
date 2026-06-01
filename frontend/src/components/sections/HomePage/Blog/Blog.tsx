"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle';
import { translations, BlogTranslations } from './Blog.translations';
import { useTranslation } from '@/hooks/useTranslation';
import { getBlogPosts } from '@/lib/services/contentService';
import styles from './Blog.module.scss';

const BlogCarousel = dynamic(
  () => import('./BlogCarousel/BlogCarousel').then((m) => m.BlogCarousel),
  { ssr: false }
);

export const Blog = () => {
  const { t, language } = useTranslation<BlogTranslations>(translations);
  const [items, setItems] = useState(t.items || []);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const posts = await getBlogPosts(language);
        if (!isMounted) {
          return;
        }
        setItems(
          posts.map((post) => ({
            author: post.author,
            title: post.title,
            href: `/blog/${post.slug}`,
          }))
        );
      } catch {
        if (isMounted) {
          setItems(t.items || []);
        }
      }
    };

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, [language, t.items]);

  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.container}>
        <SectionTitle text={t.title} className={styles.title} />
        <BlogCarousel items={items} t={t} language={language} />
      </div>
    </section>
  );
};
