"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { getEducationItem, getEducationItems } from "@/lib/services/contentService";
import type { EducationItem } from "@/types/content";
import { translations } from "@/components/sections/EducationPage/EducationListing/EducationListing.translations";
import { RegisterModal } from "@/components/ui/RegisterModal/RegisterModal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Feedback } from "@/components/sections/Feedback/Feedback";
import { EducationProgram } from "@/components/ui/EducationProgram/EducationProgram";
import { EducationCard } from "@/components/ui/EducationCard/EducationCard";
import styles from "./EducationDetail.module.scss";

const SimilarMaterials = dynamic(
  () => import("@/components/ui/SimilarMaterials/SimilarMaterials.tsx").then((m) => m.SimilarMaterials),
  { ssr: false }
);

export const EducationDetail = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const language = (params?.lang as string) || "bg";
  const slug = params?.slug as string;
  const [item, setItem] = useState<EducationItem | null>(null);
  const [allItems, setAllItems] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [paymentBanner, setPaymentBanner] = useState<"success" | "cancelled" | null>(() => {
    const paymentParam = searchParams?.get("payment");
    return paymentParam === "success" || paymentParam === "cancelled" ? paymentParam : null;
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = translations[language as "ru" | "bg"] || translations.bg;

  // Show payment result banner when redirected back from Stripe
  useEffect(() => {
    const paymentParam = searchParams?.get("payment");
    if (paymentParam === "success" || paymentParam === "cancelled") {
      // Clean up the query param without triggering a full navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState(null, "", url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadEducationData = async () => {
      setIsLoading(true);
      try {
        const [loadedItem, loadedItems] = await Promise.all([
          getEducationItem(slug, language),
          getEducationItems(language),
        ]);

        if (!isMounted) {
          return;
        }

        setItem(loadedItem);
        setAllItems(loadedItems);
      } catch {
        if (isMounted) {
          setItem(null);
          setAllItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) {
      void loadEducationData();
    }

    return () => {
      isMounted = false;
    };
  }, [language, slug]);

  const matchingItems = item
    ? allItems.filter(
        (candidate) =>
          candidate.slug !== item.slug &&
          (candidate.level === item.level || candidate.goal === item.goal)
      )
    : [];
  const similarItems = matchingItems.length > 0
    ? matchingItems.slice(0, 5)
    : item
      ? allItems.filter((candidate) => candidate.slug !== item.slug).slice(0, 5)
      : [];

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

  if (isLoading) {
    return <div className={styles.notFoundContainer}>Loading...</div>;
  }

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

  const handleWrapperClick = () => {
    handlePlayClick();
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = videoRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      if (showControls && clickY > rect.height - 50) {
        return;
      }
    }
    handlePlayClick();
  };

  return (
    <>
      {paymentBanner === "success" ? (
        <div className={styles.paymentBanner} role="status">
          <span className={styles.paymentBannerIcon}>✓</span>
          <span>
            {language === "ru"
              ? "Оплата прошла успешно! Мы свяжемся с вами в ближайшее время."
              : "Плащането беше успешно! Ще се свържем с вас в най-кратък срок."}
          </span>
          <button
            type="button"
            className={styles.paymentBannerClose}
            aria-label="Close"
            onClick={() => setPaymentBanner(null)}
          >
            ×
          </button>
        </div>
      ) : null}

      {paymentBanner === "cancelled" ? (
        <div className={`${styles.paymentBanner} ${styles.paymentBannerCancelled}`} role="status">
          <span>
            {language === "ru"
              ? "Оплата была отменена. Вы можете попробовать снова."
              : "Плащането беше отменено. Можете да опитате отново."}
          </span>
          <button
            type="button"
            className={styles.paymentBannerClose}
            aria-label="Close"
            onClick={() => setPaymentBanner(null)}
          >
            ×
          </button>
        </div>
      ) : null}

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
                  onClick={handleWrapperClick}
                >
                  <video
                    ref={videoRef}
                    src={item.mediaSrc}
                    poster={item.poster}
                    className={styles.video}
                    controls={showControls}
                    onClick={handleVideoClick}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  {!isPlaying && (
                    <button
                      className={styles.playButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick();
                      }}
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
                      <img src="/icons/Education/Vector1.svg" alt="Level" />
                    </div>
                    <span className={styles.badgeText}>{item.levelLabel}</span>
                  </div>

                  {/* Goal Badge */}
                  <div className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <img src="/icons/Education/vector2.svg" alt="Goal" />
                    </div>
                    <span className={styles.badgeText}>{item.goalLabel}</span>
                  </div>
                </div>

                {/* Format Badge */}
                <div className={styles.badgeRow}>
                  <div className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <img src="/icons/Education/vector3.svg" alt="Format" />
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
        key={`${item?.id ?? "none"}-${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        language={language}
        t={t}
      />
    </>
  );
};
