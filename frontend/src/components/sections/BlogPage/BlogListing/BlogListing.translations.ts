import { ComponentTranslations } from "@/hooks/useTranslation";

export interface BlogListingTranslations {
  breadcrumbHome: string;
  breadcrumbBlog: string;
  title: string;
  descriptionGrey: string;
  descriptionBold: string;
  filterAll: string;
  authorPrefix: string;
  readMore: string;
}

export const translations: ComponentTranslations<BlogListingTranslations> = {
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbBlog: "Блог",
    title: "блог",
    descriptionGrey: "Полезные статьи, инструкции и актуальные ",
    descriptionBold: "новости о бизнесе и бухгалтерии в Болгарии",
    filterAll: "Все темы",
    authorPrefix: "Автор:",
    readMore: "Читать",
  },
  bg: {
    breadcrumbHome: "Начало",
    breadcrumbBlog: "Блог",
    title: "блог",
    descriptionGrey: "Полезни статии, инструкции и актуални ",
    descriptionBold: "новини за бизнеса и счетоводството в България",
    filterAll: "Всички теми",
    authorPrefix: "Автор:",
    readMore: "Прочети",
  },
};
