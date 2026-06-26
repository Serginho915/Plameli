"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";
import type { EducationItem } from "@/types/content";
import styles from "./RegisterModal.module.scss";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: EducationItem | null;
  language: string;
  t: Record<string, string>;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  item,
  language,
  t,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Manage body scroll locking and escape key listener directly
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "" };

    if (!formData.name.trim()) {
      newErrors.name = t.validationName;
      valid = false;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = t.validationEmail;
      valid = false;
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 8) {
      newErrors.phone = t.validationPhone;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = await apiClient<{ url: string }>("/stripe/create-checkout/", {
        method: "POST",
        body: JSON.stringify({
          language,
          name: formData.name,
          email: formData.email,
          phone: `+359${formData.phone}`,
          itemSlug: item.slug,
          itemTitle: item.title,
          itemType: item.type,
          itemId: item.id,
        }),
      });
      window.location.href = data.url;
    } catch {
      setIsSubmitting(false);
      setSubmitError(t.paymentError);
    }
  };

  const posterSrc = item?.type === "video" ? item.poster : undefined;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Symmetrical Custom Header Row */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onClose} aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#8395AC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <h2 className={styles.title}>
            {item.type === "video" ? t.modalTitleWebinar : t.modalTitle}
          </h2>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#8395AC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {isSuccess ? (
          <div className={styles.successWrapper}>
            <div className={styles.successIconWrapper}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#EBFFD9" />
                <path
                  d="M8.5 12.5L10.5 14.5L15.5 9.5"
                  stroke="#1C6A21"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.successMsg}>{t.successMsg}</p>
            <button className={styles.successCloseBtn} onClick={onClose}>
              {t.close}
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Input fields */}
            <div className={styles.inputsSection}>
              {/* Name */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t.inputName}</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder={t.inputNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Email */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t.inputEmail}</label>
                <input
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  placeholder="ivanpetrov@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t.inputPhone}</label>
                <div className={`${styles.phoneInputWrapper} ${errors.phone ? styles.inputError : ""}`}>
                  <div className={styles.countryPrefix}>
                    <div className={styles.flag}>
                      <div className={styles.flagBg} />
                      <div className={styles.flagRed} />
                      <div className={styles.flagWhite} />
                    </div>
                    <span className={styles.prefix}>+359</span>
                  </div>
                  <input
                    type="tel"
                    className={styles.phoneInput}
                    placeholder="xxx-xxx-xxxx"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>
            </div>

            {/* Course Card Summary Details */}
            <div className={styles.courseSummaryCard}>
              <div className={styles.summaryCardInner}>
                <div className={styles.summaryHeader}>
                  <h3 className={styles.courseTitle}>{item.title}</h3>
                </div>
                <div className={styles.summaryBody}>
                  <div className={styles.courseImageWrapper}>
                    {posterSrc || (item.type !== "video" && item.mediaSrc) ? (
                      <Image
                        src={posterSrc || item.mediaSrc}
                        alt={item.title}
                        fill
                        className={styles.courseImage}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.imageFallback} />
                    )}
                  </div>
                  <div className={styles.courseMetaColumn}>
                    {/* Start Date */}
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.startLabel}</span>
                      <div className={styles.metaPill}>
                        <span className={styles.metaValue}>{item.startDate}</span>
                      </div>
                    </div>
                    {/* Format */}
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t.formatLabel}</span>
                      <div className={styles.metaPill}>
                        <span className={styles.metaValue}>{item.format}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Green Info Box (Access for 12 months) */}
            {item.type !== "video" && (
              <div className={styles.accessInfoBox}>
                <div className={styles.accessHeader}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.accessIcon}>
                    <rect width="24" height="24" rx="12" fill="#1C6A21" opacity="0.1" />
                    <path
                      d="M12 7V12L15 15"
                      stroke="#1C6A21"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className={styles.accessTitle}>{t.accessTitle}</span>
                </div>
                <div className={styles.accessBody}>
                  <p className={styles.accessSubtitle}>{t.accessSubtitle}</p>
                </div>
              </div>
            )}

            {/* Price Row */}
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>{t.toPay}</span>
              <span className={styles.priceValue}>{item.price} (EUR)</span>
            </div>

            {/* Submit Orange Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <span className={styles.submitText}>
                {item.type === "video" ? t.payBtnWebinar : t.payBtn}
              </span>
            </button>

            {submitError ? (
              <p className={styles.submitErrorText}>{submitError}</p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
};
