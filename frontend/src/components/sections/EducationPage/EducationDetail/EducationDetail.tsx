"use client";

import React, { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getMockCourses, getMockWebinars } from "@/components/sections/EducationPage/EducationListing/mockData.ts";
import { translations } from "@/components/sections/EducationPage/EducationListing/EducationListing.translations.ts";
import { RegisterModal } from "@/components/ui/RegisterModal/RegisterModal.tsx";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs.tsx";
import { Feedback } from "@/components/sections/Feedback/Feedback.tsx";
import { EducationProgram } from "@/components/ui/EducationProgram/EducationProgram.tsx";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { EducationCard } from "@/components/ui/EducationCard/EducationCard.tsx";
import styles from "./EducationDetail.module.scss";

const SimilarMaterials = dynamic(
  () => import("@/components/ui/SimilarMaterials/SimilarMaterials.tsx").then((m) => m.SimilarMaterials),
  { ssr: false }
);

export const EducationDetail = () => {
  const params = useParams();
  const router = useRouter();

  const language = (params?.lang as string) || "bg";
  const slug = params?.slug as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = translations[language as "ru" | "bg"] || translations.bg;

  // Dynamic Lookup (Memoized)
  const item = useMemo(() => {
    const courses = getMockCourses(language);
    const webinars = getMockWebinars(language);

    const matchedCourse = courses.find((c) => c.slug === slug);
    if (matchedCourse) return matchedCourse;

    const matchedWebinar = webinars.find((w) => w.slug === slug);
    if (matchedWebinar) return matchedWebinar;

    return null;
  }, [language, slug]);

  const similarItems = useMemo(() => {
    if (!item) return [];
    const courses = getMockCourses(language);
    const webinars = getMockWebinars(language);
    const allItems = [...courses, ...webinars];

    // Filter out current item and look for matching level or goal
    const matching = allItems.filter(
      (c) => c.slug !== item.slug && (c.level === item.level || c.goal === item.goal)
    );

    if (matching.length > 0) {
      return matching.slice(0, 5);
    }

    // Fallback: just return the first 5 items excluding the current one
    return allItems.filter((c) => c.slug !== item.slug).slice(0, 5);
  }, [language, item]);

  // Dynamic values
  const isVideo = item?.type === "video";

  const ctaBtnText = useMemo(() => {
    if (!item) return "";
    return isVideo ? t.detailStartWebinar : t.detailStartCourse;
  }, [item, isVideo, t]);

  const programCardTitle = useMemo(() => {
    if (!item) return "";
    return isVideo ? t.detailProgramWebinar : t.detailProgramCourse;
  }, [item, isVideo, t]);

  const breadcrumbItems = useMemo(() => {
    if (!item) return [];
    return [
      { label: t.breadcrumbHome, href: `/${language}` },
      { label: t.breadcrumbEducation, href: `/${language}/education` },
      { label: item.title }
    ];
  }, [language, t, item]);

  // Memoized Static Columns to avoid re-renders when local UI video/modal states toggle
  const leftColumnContent = useMemo(() => {
    if (!item) return null;
    return (
      <div className={styles.leftCol}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{item.title}</h1>
        </div>

        <div className={styles.descriptionRow}>
          <p className={styles.description}>{item.description}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.ctaButton}
          aria-label={ctaBtnText}
        >
          <span className={styles.ctaText}>{ctaBtnText}</span>
        </button>
      </div>
    );
  }, [item, ctaBtnText]);

  const programCardContent = useMemo(() => {
    if (!item || !item.program || item.program.length === 0) return null;
    return (
      <EducationProgram program={item.program} title={programCardTitle} />
    );
  }, [item, programCardTitle]);

  const similarMaterialsSection = useMemo(() => {
    if (similarItems.length === 0) return null;
    return (
      <SimilarMaterials title={t.similarMaterials}>
        {similarItems.map((simItem) => (
          <EducationCard
            key={simItem.id}
            title={simItem.title}
            type={simItem.type}
            mediaSrc={simItem.mediaSrc}
            poster={simItem.type === "video" ? simItem.poster : undefined}
            meta={[
              { label: t.startLabel, value: simItem.startDate },
              { label: t.formatLabel, value: simItem.format },
              { label: t.priceLabel, value: simItem.price, isPrice: true },
            ]}
            learnMoreHref={`/${language}/education/${simItem.slug}`}
            signUpHref={`/${language}/education/${simItem.slug}#register`}
            learnMoreLabel={t.learnMore}
            signUpLabel={t.signUp}
          />
        ))}
      </SimilarMaterials>
    );
  }, [similarItems, language, t]);

  const feedbackSection = useMemo(() => (
    <Feedback />
  ), []);

  // Fallback state if slug not found
  if (!item) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>
          {t.detailNotFoundTitle}
        </h1>
        <p className={styles.notFoundText}>
          {t.detailNotFoundDesc}
        </p>
        <Link href={`/${language}/education`} className={styles.notFoundLink}>
          {t.detailNotFoundBtn}
        </Link>
      </div>
    );
  }

  const handlePlayClick = () => {
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
    <>
      <div className={styles.container}>
        {/* Reusable breadcrumbs component */}
        <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

        {/* Dynamic Detail Split Columns Grid Layout */}
        <div className={styles.layout}>

          {/* Left Column: Memoized Info & Action Call */}
          {leftColumnContent}

          {/* Right Column: Media poster + Floating Badges + Program Modules list */}
          <div className={styles.rightCol}>

            {/* Visual media poster block */}
            <div className={styles.mediaCard}>
              {isVideo ? (
                <div
                  className={styles.videoWrapper}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  <video
                    ref={videoRef}
                    src={item.mediaSrc}
                    poster={item.poster}
                    className={styles.video}
                    controls={showControls}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  {!isPlaying && (
                    <button
                      className={styles.playButton}
                      onClick={handlePlayClick}
                      aria-label={t.detailPlayVideo}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.mediaSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.mediaImage}
                    priority
                  />
                </div>
              )}

              {/* Absolute Badge Overlays */}
              <div className={styles.badgeOverlay}>
                <div className={styles.badgeRow}>
                  {/* Level Badge */}
                  <div className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <img src="/icons/education/Vector1.svg" alt="" />
                    </div>
                    <span className={styles.badgeText}>{item.levelLabel}</span>
                  </div>

                  {/* Goal Badge */}
                  <div className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <img src="/icons/education/vector2.svg" alt="" />
                    </div>
                    <span className={styles.badgeText}>{item.goalLabel}</span>
                  </div>
                </div>

                {/* Format Badge */}
                <div className={styles.badgeRow}>
                  <div className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <img src="/icons/education/vector3.svg" alt="" />
                    </div>
                    <span className={styles.badgeText}>{item.formatLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memoized Course Program Panel Card */}
            {programCardContent}

          </div>
        </div>
      </div>

      {similarMaterialsSection}

      {/* Symmetrical Feedback Form Row Section (Memoized) */}
      {feedbackSection}

      {/* Decoupled symmetrical course registration modal popup */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        language={language}
        t={t}
      />
    </>
  );
};
