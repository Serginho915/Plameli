"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs.tsx";
import { BlogCard } from "@/components/ui/BlogCard/BlogCard.tsx";
import { Feedback } from "@/components/sections/Feedback/Feedback.tsx";
import { getMockBlogPosts } from "@/components/sections/BlogPage/BlogDetail/mockData.ts";
import { translations, BlogListingTranslations } from "./BlogListing.translations.ts";
import styles from "./BlogListing.module.scss";

interface BlogListingProps {
  language: string;
}

export const BlogListing: React.FC<BlogListingProps> = ({ language }) => {
  const { t } = useTranslation<BlogListingTranslations>(translations);

  const posts = useMemo(() => getMockBlogPosts(language), [language]);

  const breadcrumbItems = [
    { label: t.breadcrumbHome, href: `/${language}` },
    { label: t.breadcrumbBlog },
  ];

  return (
    <>
      <section className={styles.blogListing}>
        <div className={styles.container}>
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.description}>
              <span className={styles.descriptionGrey}>{t.descriptionGrey}</span>
              <span className={styles.descriptionBold}>{t.descriptionBold}</span>
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className={styles.grid}>
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                authorLabel={t.authorPrefix}
                authorName={post.author}
                title={post.title}
                readLabel={t.readMore}
                href={`/${language}/blog/${post.slug}`}
                className={styles.card}
              />
            ))}
          </div>
        </div>
      </section>

      <Feedback />
    </>
  );
};
