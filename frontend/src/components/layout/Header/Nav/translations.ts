import { ComponentTranslations } from "@/hooks/useTranslation";

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
      { label: "Связаться", anchor: "contacts" }
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
      { label: "Свържете се", anchor: "contacts" }
    ]
  },
} satisfies ComponentTranslations;