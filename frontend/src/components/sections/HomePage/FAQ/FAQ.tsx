"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle.tsx";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { translations, FAQTranslations } from "./FAQ.translations.ts";
import styles from "./FAQ.module.scss";

export const FAQ = () => {
  const { t } = useTranslation<FAQTranslations>(translations);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: t.categories.all },
    { id: "payment", label: t.categories.payment },
    { id: "education", label: t.categories.education },
    { id: "accounting", label: t.categories.accounting },
    { id: "taxes", label: t.categories.taxes },
  ];

  const filteredItems = t.items.filter(
    (item) => activeCategory === "all" || item.category === activeCategory,
  );

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faq} id="faq">
      <SectionTitle text={t.title} className={styles.title} />

      <div className={styles.content}>
        <div className={styles.sidebar}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.accordion}>
          {filteredItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={styles.accordionItem}>
                <div
                  className={`${styles.questionBox} ${isOpen ? styles.isOpen : ""}`}
                  onClick={() => toggleItem(index)}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <div className={styles.arrow}>
                    <svg
                      viewBox="0 0 19 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L9.5 9.5L18 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={styles.answerWrapper}
                    >
                      <div className={styles.answerBox}>
                        <p className={styles.answerText}>{item.answer}</p>
                        <div className={styles.answerIcon}>
                          <svg
                            viewBox="0 0 19 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L9.5 9.5L18 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
