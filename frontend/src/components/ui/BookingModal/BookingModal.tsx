"use client";

import React from "react";
import { useUI } from "@/context/UIContext";
import { BookingWidget } from "@/components/sections/ConsultationPage/Hero/BookingWidget/BookingWidget";
import styles from "./BookingModal.module.scss";

export const BookingModal = () => {
  const { isBookingModalOpen, closeBookingModal } = useUI();

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBookingModal();
      }
    };
    if (isBookingModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isBookingModalOpen, closeBookingModal]);

  if (!isBookingModalOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeBookingModal}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeBookingModal} aria-label="Close modal">
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
        <div className={styles.content}>
          <BookingWidget />
        </div>
      </div>
    </div>
  );
};
