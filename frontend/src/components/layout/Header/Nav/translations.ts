import { ComponentTranslations } from "@/hooks/useTranslation.ts";

export const translations = {
  ru: {
    nav_about_expert: "Об эксперте",
    nav_education: "Обучение",
    nav_blog: "Блог",
    dropdown_items: [
      { label: "Услуги", anchor: "services" },
      { label: "Достижения", anchor: "achievements" },
      { label: "Отзывы", anchor: "reviews" },
      { label: "FAQ", anchor: "faq" },
      { label: "Связаться", anchor: "contact" }
    ]
  },
  bg: {
    nav_about_expert: "За експерта",
    nav_education: "Обучение",
    nav_blog: "Блог",
    dropdown_items: [
      { label: "Услуги", anchor: "services" },
      { label: "Постижения", anchor: "achievements" },
      { label: "Отзиви", anchor: "reviews" },
      { label: "FAQ", anchor: "faq" },
      { label: "Свържете се", anchor: "contact" }
    ]
  },
} satisfies ComponentTranslations;