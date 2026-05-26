"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "@/hooks/useTranslation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { Feedback } from "@/components/sections/Feedback/Feedback";
import { BlogPost } from "./mockData";
import { translations } from "./BlogDetail.translations";
import styles from "./BlogDetail.module.scss";

const BlogCarousel = dynamic(
  () => import("@/components/sections/HomePage/Blog/BlogCarousel/BlogCarousel.tsx").then((m) => m.BlogCarousel),
  { ssr: false }
);

// Props are passed from the page layer (currently mock, future API)
// This keeps the component pure and API-ready — swap data source in page.tsx only
interface BlogDetailProps {
  post: BlogPost;
  allPosts: BlogPost[];
  language: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ post, allPosts, language }) => {
  const { t } = useTranslation(translations);
  const isRu = language === "ru";

  // Similar posts filtered by shared tags — derived via useMemo from passed allPosts
  const similarBlogs = useMemo(() => {
    const filtered = allPosts.filter((p) => p.slug !== post.slug);

    const matching = filtered.filter((p) =>
      p.tags.some((tag) => post.tags.includes(tag))
    );

    return matching.length > 0 ? matching.slice(0, 3) : filtered.slice(0, 3);
  }, [post, allPosts]);

  // Breadcrumbs derived via useMemo
  const breadcrumbItems = useMemo(() => [
    { label: t.breadcrumbHome, href: `/${language}` },
    { label: t.breadcrumbBlog, href: `/${language}#blog` },
    { label: post.title },
  ], [language, t, post.title]);

  // Carousel items derived via useMemo
  const carouselItems = useMemo(() =>
    similarBlogs.map((p) => ({
      author: p.author,
      title: p.title,
      href: `/blog/${p.slug}`,
    })),
    [similarBlogs]
  );

  return (
    <>
      <article className={styles.blogPage}>
        <div className={styles.container}>
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

          {/* Cover image + tags + author */}
          <div className={styles.metaSection}>
            <div className={styles.coverImageWrapper}>
              <img
                src={post.mediaSrc}
                alt={post.title}
                className={styles.coverImage}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/1346x608/697b91/ffffff?text=${encodeURIComponent(post.title)}`;
                }}
              />
            </div>

            <div className={styles.metaRow}>
              <div className={styles.tags}>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.authorDate}>
                <span className={styles.authorName}>{post.author}</span>
                <span className={styles.bullet} />
                <span className={styles.date}>{post.date}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{post.title}</h1>
          </div>

          {/* Article content */}
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              {post.content.map((paragraph, idx) => (
                <p key={idx} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Similar Blog Articles — same layout as homepage Blog section */}
      {similarBlogs.length > 0 && (
        <section className={styles.readAlsoSection}>
          <div className={styles.readAlsoContainer}>
            <SectionTitle text={t.readAlso} className={styles.readAlsoTitle} />
            <BlogCarousel
              items={carouselItems}
              t={{
                title: t.readAlso,
                readMore: isRu ? "Читать" : "Прочети",
                authorPrefix: t.authorPrefix,
                items: [],
              }}
              language={language}
            />
          </div>
        </section>
      )}

      {/* Feedback / Contact section */}
      <Feedback />
    </>
  );
};
