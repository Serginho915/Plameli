import { ComponentTranslations } from "@/hooks/useTranslation";

export interface BlogDetailTranslations {
  breadcrumbHome: string;
  breadcrumbBlog: string;
  readAlso: string;
  authorPrefix: string;
  notFoundTitle: string;
  notFoundDesc: string;
  notFoundBtn: string;
}

export const translations: ComponentTranslations<BlogDetailTranslations> = {
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbBlog: "Блог",
    readAlso: "читайте также",
    authorPrefix: "Автор:",
    notFoundTitle: "Статья не найдена",
    notFoundDesc: "К сожалению, запрашиваемая статья блога не существует.",
    notFoundBtn: "Вернуться в блог",
  },
  bg: {
    breadcrumbHome: "Начало",
    breadcrumbBlog: "Блог",
    readAlso: "прочетете също",
    authorPrefix: "Автор:",
    notFoundTitle: "Статията не е намерена",
    notFoundDesc: "За съжаление търсената статия не съществува.",
    notFoundBtn: "Върнете се в блога",
  },
};
