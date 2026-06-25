"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Logo } from "@/components/layout/Header/Logo/Logo";
import { RichTextEditor } from "./RichTextEditor";
import styles from "./AdminPage.module.scss";

type PanelTab = "blog" | "education" | "requests";
type RequestTab = "feedback" | "educationRegistrations" | "consultationBookings";

interface AdminUser {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface BlogPostItem {
  id?: number;
  slug: string;
  author: string;
  tags: string[];
  media_src: string;
  published_at: string;
  title_ru: string;
  title_bg: string;
  content_ru: string;
  content_bg: string;
  is_published: boolean;
}

interface EducationModuleItem {
  id?: number;
  sort_order: number;
  title_ru: string;
  title_bg: string;
  description_ru: string;
  description_bg: string;
}

interface EducationItem {
  id?: number;
  item_type: "course" | "webinar";
  slug: string;
  image_src: string;
  video_src: string;
  title_ru: string;
  title_bg: string;
  description_ru: string;
  description_bg: string;
  start_date: string;
  price: string;
  level: "beginner" | "experienced" | "business";
  goal: "launch" | "taxes" | "profession" | "optimization";
  item_format: "online" | "live" | "offline";
  is_published: boolean;
  program: EducationModuleItem[];
}

interface FeedbackRequest {
  id: number;
  language: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  source: string;
  created_at: string;
}

interface EducationRegistration {
  id: number;
  language: string;
  item_external_id: string;
  item_slug: string;
  item_title: string;
  item_type: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

interface ConsultationBooking {
  id: number;
  language: string;
  consultation_format: string;
  meeting_type: string;
  name: string;
  email: string;
  phone: string;
  selected_date: string;
  selected_time: string;
  total_amount_eur: string;
  status: string;
  created_at: string;
}

interface AdminTranslations {
  loginTitle: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signIn: string;
  signingIn: string;
  adminTitle: string;
  subtitle: string;
  logOut: string;
  tabs: {
    blog: string;
    education: string;
    requests: string;
  };
  status: {
    savingBlogPost: string;
    blogPostSaved: string;
    failedToSaveBlogPost: string;
    failedToUploadBlogImage: string;
    blogPostDeleted: string;
    failedToDeleteBlogPost: string;
    savingEducationItem: string;
    educationItemSaved: string;
    failedToSaveEducationItem: string;
    educationItemDeleted: string;
    failedToDeleteEducationItem: string;
    authorizationFailed: string;
    loginFailed: string;
  };
  common: {
    yes: string;
    no: string;
    new: string;
    save: string;
    delete: string;
    editBlogPost: string;
    createBlogPost: string;
    editEducationItem: string;
    createEducationItem: string;
  };
  blog: {
    title: string;
    empty: string;
    slug: string;
    author: string;
    date: string;
    published: string;
    titleRu: string;
    titleBg: string;
    coverImage: string;
    currentCover: string;
    tags: string;
    addTag: string;
    noTags: string;
    tagPlaceholder: string;
    contentRu: string;
    contentBg: string;
  };
  education: {
    title: string;
    empty: string;
    type: string;
    published: string;
    slug: string;
    image: string;
    video: string;
    currentVideo: string;
    titleRu: string;
    titleBg: string;
    descriptionRu: string;
    descriptionBg: string;
    startDate: string;
    price: string;
    level: string;
    goal: string;
    format: string;
    typeCourse: string;
    typeWebinar: string;
    levelBeginner: string;
    levelExperienced: string;
    levelBusiness: string;
    goalLaunch: string;
    goalTaxes: string;
    goalProfession: string;
    goalOptimization: string;
    formatOnline: string;
    formatLive: string;
    formatOffline: string;
    programModules: string;
    addModule: string;
    noModulesYet: string;
    sort: string;
    titleRuModule: string;
    titleBgModule: string;
    descriptionRuModule: string;
    descriptionBgModule: string;
    removeModule: string;
  };
  requests: {
    title: string;
    refresh: string;
    feedback: string;
    education: string;
    consultations: string;
    noRecordsYet: string;
  };
}

const translations: Record<"ru" | "bg", AdminTranslations> = {
  ru: {
    loginTitle: "Админ панель",
    usernameLabel: "Имя пользователя",
    usernamePlaceholder: "admin",
    passwordLabel: "Пароль",
    passwordPlaceholder: "••••••••",
    signIn: "Войти",
    signingIn: "Вход...",
    adminTitle: "Админ панель",
    subtitle: "Управление контентом сайта и входящими запросами",
    logOut: "Выйти",
    tabs: {
      blog: "Блог",
      education: "Обучение",
      requests: "Запросы",
    },
    status: {
      savingBlogPost: "Сохранение статьи...",
      blogPostSaved: "Статья сохранена",
      failedToSaveBlogPost: "Не удалось сохранить статью",
      failedToUploadBlogImage: "Не удалось загрузить изображение",
      blogPostDeleted: "Статья удалена",
      failedToDeleteBlogPost: "Не удалось удалить статью",
      savingEducationItem: "Сохранение материала...",
      educationItemSaved: "Материал сохранён",
      failedToSaveEducationItem: "Не удалось сохранить материал",
      educationItemDeleted: "Материал удалён",
      failedToDeleteEducationItem: "Не удалось удалить материал",
      authorizationFailed: "Ошибка авторизации",
      loginFailed: "Не удалось войти",
    },
    common: {
      yes: "Да",
      no: "Нет",
      new: "+",
      save: "Сохранить",
      delete: "Удалить",
      editBlogPost: "Редактировать статью",
      createBlogPost: "Создать статью",
      editEducationItem: "Редактировать материал",
      createEducationItem: "Создать материал",
    },
    blog: {
      title: "Статьи",
      empty: "Статей пока нет",
      slug: "Slug",
      author: "Автор",
      date: "Дата",
      published: "Опубликовано",
      titleRu: "Заголовок RU",
      titleBg: "Заголовок BG",
      coverImage: "Обложка",
      currentCover: "Текущая обложка",
      tags: "Теги",
      addTag: "Добавить тег",
      noTags: "Тегов пока нет",
      tagPlaceholder: "Например: налоги",
      contentRu: "Контент RU",
      contentBg: "Контент BG",
    },
    education: {
      title: "Обучение",
      empty: "Материалов пока нет",
      type: "Тип",
      published: "Опубликовано",
      slug: "Slug",
      image: "Картинка",
      video: "Видео",
      currentVideo: "Текущее видео",
      titleRu: "Заголовок RU",
      titleBg: "Заголовок BG",
      descriptionRu: "Описание RU",
      descriptionBg: "Описание BG",
      startDate: "Дата старта",
      price: "Цена",
      level: "Уровень",
      goal: "Цель",
      format: "Формат",
      typeCourse: "Курс",
      typeWebinar: "Вебинар",
      levelBeginner: "Начальный",
      levelExperienced: "Опытный",
      levelBusiness: "Бизнес",
      goalLaunch: "Запуск",
      goalTaxes: "Налоги",
      goalProfession: "Профессия",
      goalOptimization: "Оптимизация",
      formatOnline: "Онлайн",
      formatLive: "Вживую",
      formatOffline: "Оффлайн",
      programModules: "Модули программы",
      addModule: "Добавить модуль",
      noModulesYet: "Модулей пока нет",
      sort: "Порядок",
      titleRuModule: "Заголовок RU",
      titleBgModule: "Заголовок BG",
      descriptionRuModule: "Описание RU",
      descriptionBgModule: "Описание BG",
      removeModule: "Удалить модуль",
    },
    requests: {
      title: "Входящие запросы",
      refresh: "Обновить",
      feedback: "Обратная связь",
      education: "Обучение",
      consultations: "Консультации",
      noRecordsYet: "Записей пока нет",
    },
  },
  bg: {
    loginTitle: "Админ панел",
    usernameLabel: "Потребителско име",
    usernamePlaceholder: "admin",
    passwordLabel: "Парола",
    passwordPlaceholder: "••••••••",
    signIn: "Вход",
    signingIn: "Влизане...",
    adminTitle: "Админ панел",
    subtitle: "Управление на съдържанието на сайта и входящите заявки",
    logOut: "Изход",
    tabs: {
      blog: "Блог",
      education: "Обучение",
      requests: "Заявки",
    },
    status: {
      savingBlogPost: "Запазване на статията...",
      blogPostSaved: "Статията е запазена",
      failedToSaveBlogPost: "Неуспешно запазване на статията",
      failedToUploadBlogImage: "Неуспешно качване на изображението",
      blogPostDeleted: "Статията е изтрита",
      failedToDeleteBlogPost: "Неуспешно изтриване на статията",
      savingEducationItem: "Запазване на материала...",
      educationItemSaved: "Материалът е запазен",
      failedToSaveEducationItem: "Неуспешно запазване на материала",
      educationItemDeleted: "Материалът е изтрит",
      failedToDeleteEducationItem: "Неуспешно изтриване на материала",
      authorizationFailed: "Грешка при удостоверяването",
      loginFailed: "Неуспешен вход",
    },
    common: {
      yes: "Да",
      no: "Не",
      new: "+",
      save: "Запази",
      delete: "Изтрий",
      editBlogPost: "Редактиране на статия",
      createBlogPost: "Създаване на статия",
      editEducationItem: "Редактиране на материал",
      createEducationItem: "Създаване на материал",
    },
    blog: {
      title: "Статии",
      empty: "Все още няма статии",
      slug: "Slug",
      author: "Автор",
      date: "Дата",
      published: "Публикувано",
      titleRu: "Заглавие RU",
      titleBg: "Заглавие BG",
      coverImage: "Корица",
      currentCover: "Текуща корица",
      tags: "Тагове",
      addTag: "Добави таг",
      noTags: "Все още няма тагове",
      tagPlaceholder: "Например: данъци",
      contentRu: "Съдържание RU",
      contentBg: "Съдържание BG",
    },
    education: {
      title: "Обучение",
      empty: "Все още няма материали",
      type: "Тип",
      published: "Публикувано",
      slug: "Slug",
      image: "Изображение",
      video: "Видео",
      currentVideo: "Текущо видео",
      titleRu: "Заглавие RU",
      titleBg: "Заглавие BG",
      descriptionRu: "Описание RU",
      descriptionBg: "Описание BG",
      startDate: "Начална дата",
      price: "Цена",
      level: "Ниво",
      goal: "Цел",
      format: "Формат",
      typeCourse: "Курс",
      typeWebinar: "Уебинар",
      levelBeginner: "Начинаещ",
      levelExperienced: "Напреднал",
      levelBusiness: "Бизнес",
      goalLaunch: "Стартиране",
      goalTaxes: "Данъци",
      goalProfession: "Професия",
      goalOptimization: "Оптимизация",
      formatOnline: "Онлайн",
      formatLive: "На живо",
      formatOffline: "Офлайн",
      programModules: "Модули на програмата",
      addModule: "Добави модул",
      noModulesYet: "Все още няма модули",
      sort: "Ред",
      titleRuModule: "Заглавие RU",
      titleBgModule: "Заглавие BG",
      descriptionRuModule: "Описание RU",
      descriptionBgModule: "Описание BG",
      removeModule: "Премахни модул",
    },
    requests: {
      title: "Входящи заявки",
      refresh: "Обнови",
      feedback: "Обратна връзка",
      education: "Обучение",
      consultations: "Консултации",
      noRecordsYet: "Все още няма записи",
    },
  },
};

const AUTH_KEY = "admin.basicAuthToken";
const USERNAME_KEY = "admin.username";

function readSessionValue(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage.getItem(key);
}

const emptyBlogPost = (): BlogPostItem => ({
  slug: "",
  author: "",
  tags: [],
  media_src: "",
  published_at: new Date().toISOString().slice(0, 10),
  title_ru: "",
  title_bg: "",
  content_ru: "",
  content_bg: "",
  is_published: true,
});

const emptyEducation = (): EducationItem => ({
  item_type: "course",
  slug: "",
  image_src: "",
  video_src: "",
  title_ru: "",
  title_bg: "",
  description_ru: "",
  description_bg: "",
  start_date: new Date().toISOString().slice(0, 10),
  price: "",
  level: "beginner",
  goal: "launch",
  item_format: "online",
  is_published: true,
  program: [],
});

function resolveApiAdminBase(): string {
  const fallback = "http://localhost:8000";
  const raw = process.env.NEXT_PUBLIC_API_URL || `${fallback}/api`;

  try {
    const url = new URL(raw);
    return `${url.origin}/api/admin`;
  } catch {
    const withoutApi = raw.replace(/\/api\/?$/, "");
    return `${withoutApi}/api/admin`;
  }
}

const ADMIN_API_BASE = resolveApiAdminBase();
type UiLang = "ru" | "bg";

type RequestRecord = FeedbackRequest | EducationRegistration | ConsultationBooking;

interface RequestColumn {
  key: string;
  label_ru: string;
  label_bg: string;
}

const REQUEST_COLUMNS: Record<RequestTab, RequestColumn[]> = {
  feedback: [
    { key: "id", label_ru: "ID", label_bg: "ID" },
    { key: "name", label_ru: "Имя", label_bg: "Име" },
    { key: "email", label_ru: "Email", label_bg: "Email" },
    { key: "message", label_ru: "Сообщение", label_bg: "Съобщение" },
    { key: "created_at", label_ru: "Создано", label_bg: "Създадено" },
  ],
  educationRegistrations: [
    { key: "id", label_ru: "ID", label_bg: "ID" },
    { key: "item_title", label_ru: "Материал", label_bg: "Материал" },
    { key: "item_slug", label_ru: "Slug", label_bg: "Slug" },
    { key: "item_type", label_ru: "Тип", label_bg: "Тип" },
    { key: "name", label_ru: "Имя", label_bg: "Име" },
    { key: "phone", label_ru: "Телефон", label_bg: "Телефон" },
    { key: "email", label_ru: "Email", label_bg: "Email" },
    { key: "status", label_ru: "Статус", label_bg: "Статус" },
    { key: "language", label_ru: "Язык", label_bg: "Език" },
    { key: "created_at", label_ru: "Создано", label_bg: "Създадено" },
  ],
  consultationBookings: [
    { key: "id", label_ru: "ID", label_bg: "ID" },
    { key: "name", label_ru: "Имя", label_bg: "Име" },
    { key: "phone", label_ru: "Телефон", label_bg: "Телефон" },
    { key: "email", label_ru: "Email", label_bg: "Email" },
    { key: "consultation_format", label_ru: "Формат", label_bg: "Формат" },
    { key: "meeting_type", label_ru: "Тип встречи", label_bg: "Тип среща" },
    { key: "selected_date", label_ru: "Дата", label_bg: "Дата" },
    { key: "selected_time", label_ru: "Время", label_bg: "Час" },
    { key: "total_amount_eur", label_ru: "Сумма (EUR)", label_bg: "Сума (EUR)" },
    { key: "status", label_ru: "Статус", label_bg: "Статус" },
    { key: "language", label_ru: "Язык", label_bg: "Език" },
    { key: "created_at", label_ru: "Создано", label_bg: "Създадено" },
  ],
};

function resolveAdminAssetUrl(value: string): string {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/media/")) {
    return `${ADMIN_API_BASE.replace(/\/api\/admin$/, "")}${value}`;
  }

  return value;
}

function formatRequestCell(
  item: RequestRecord,
  key: string,
  locale: string,
): string {
  if (key === "created_at") {
    const value = item.created_at;
    return value ? new Date(value).toLocaleString(locale) : "-";
  }

  const value = (item as unknown as Record<string, unknown>)[key];

  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || "-";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function flattenApiError(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenApiError);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenApiError);
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [String(value)];
}

function replaceAllText(source: string, search: string, replacement: string): string {
  return source.split(search).join(replacement);
}

function prettyApiFieldName(field: string, lang: UiLang): string {
  const ruNames: Record<string, string> = {
    slug: "Slug",
    author: "Автор",
    title_ru: "Заголовок RU",
    title_bg: "Заголовок BG",
    content_ru: "Контент RU",
    content_bg: "Контент BG",
    published_at: "Дата",
    tags: "Теги",
    media_file: "Обложка",
    image_file: "Картинка",
    video_file: "Видео",
    item_type: "Тип",
    non_field_errors: "Ошибка",
    detail: "Ошибка",
  };

  const bgNames: Record<string, string> = {
    slug: "Slug",
    author: "Автор",
    title_ru: "Заглавие RU",
    title_bg: "Заглавие BG",
    content_ru: "Съдържание RU",
    content_bg: "Съдържание BG",
    published_at: "Дата",
    tags: "Тагове",
    media_file: "Корица",
    image_file: "Изображение",
    video_file: "Видео",
    item_type: "Тип",
    non_field_errors: "Грешка",
    detail: "Грешка",
  };

  const names = lang === "bg" ? bgNames : ruNames;
  return names[field] || field;
}

function localizeValidationText(message: string, lang: UiLang): string {
  const ruMap: Record<string, string> = {
    "This field may not be blank.": "Это поле не может быть пустым.",
    "This field is required.": "Это поле обязательно.",
    "This list may not be empty.": "Список не может быть пустым.",
    "Not a valid list.": "Некорректный список.",
    "Not a valid string.": "Некорректная строка.",
    "Not a valid boolean.": "Некорректное булево значение.",
    "A valid integer is required.": "Требуется корректное целое число.",
    "A valid date is required.": "Требуется корректная дата.",
    "Date has wrong format. Use one of these formats instead": "Неверный формат даты. Используйте один из форматов",
    "Enter a valid date.": "Введите корректную дату.",
    "Invalid username/password.": "Неверное имя пользователя или пароль.",
    "Authentication credentials were not provided.": "Не предоставлены данные аутентификации.",
    "You do not have permission to perform this action.": "У вас нет прав для выполнения этого действия.",
    "No file was submitted.": "Файл не был отправлен.",
    "The submitted data was not a file.": "Переданные данные не являются файлом.",
    "File is required.": "Файл обязателен.",
    "Blog post requires a cover image.": "Для статьи требуется обложка.",
    "Course requires an image.": "Для курса требуется изображение.",
    "Webinar requires an image.": "Для вебинара требуется изображение.",
    "Webinar requires a video.": "Для вебинара требуется видео.",
  };

  const bgMap: Record<string, string> = {
    "This field may not be blank.": "Това поле не може да бъде празно.",
    "This field is required.": "Това поле е задължително.",
    "This list may not be empty.": "Списъкът не може да бъде празен.",
    "Not a valid list.": "Невалиден списък.",
    "Not a valid string.": "Невалиден низ.",
    "Not a valid boolean.": "Невалидна булева стойност.",
    "A valid integer is required.": "Изисква се валидно цяло число.",
    "A valid date is required.": "Изисква се валидна дата.",
    "Date has wrong format. Use one of these formats instead": "Невалиден формат на датата. Използвайте един от форматите",
    "Enter a valid date.": "Въведете валидна дата.",
    "Invalid username/password.": "Невалидно потребителско име или парола.",
    "Authentication credentials were not provided.": "Не са предоставени данни за удостоверяване.",
    "You do not have permission to perform this action.": "Нямате права за това действие.",
    "No file was submitted.": "Не е изпратен файл.",
    "The submitted data was not a file.": "Изпратените данни не са файл.",
    "File is required.": "Файлът е задължителен.",
    "Blog post requires a cover image.": "За статията е нужна корица.",
    "Course requires an image.": "За курса е нужно изображение.",
    "Webinar requires an image.": "За уебинара е нужно изображение.",
    "Webinar requires a video.": "За уебинара е нужно видео.",
  };

  const dictionary = lang === "bg" ? bgMap : ruMap;
  let localized = message;

  for (const [source, target] of Object.entries(dictionary)) {
    localized = replaceAllText(localized, source, target);
  }

  return localized;
}

function toReadableApiError(rawMessage: string, fallback: string, lang: UiLang): string {
  if (!rawMessage) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawMessage) as unknown;

    if (typeof parsed === "string") {
      return localizeValidationText(parsed, lang);
    }

    if (Array.isArray(parsed)) {
      const items = flattenApiError(parsed).filter(Boolean).map((item) => localizeValidationText(item, lang));
      return items.length > 0 ? items.join("; ") : fallback;
    }

    if (parsed && typeof parsed === "object") {
      const messages = Object.entries(parsed as Record<string, unknown>)
        .map(([field, value]) => {
          const lines = flattenApiError(value).filter(Boolean);
          if (lines.length === 0) {
            return "";
          }
          return `${prettyApiFieldName(field, lang)}: ${lines.map((line) => localizeValidationText(line, lang)).join(", ")}`;
        })
        .filter(Boolean);

      return messages.length > 0 ? messages.join("; ") : fallback;
    }
  } catch {
    // Keep the original text if it is not JSON.
  }

  if (rawMessage.startsWith("HTTP ")) {
    return fallback;
  }

  return localizeValidationText(rawMessage, lang);
}

export default function AdminPage() {
  const { t, language } = useTranslation(translations);
  const uiLang: UiLang = language === "bg" ? "bg" : "ru";
  const [tab, setTab] = useState<PanelTab>("blog");
  const [requestTab, setRequestTab] = useState<RequestTab>("feedback");
  const [username, setUsername] = useState(() => readSessionValue(USERNAME_KEY) || "");
  const [password, setPassword] = useState("");
  const [authHeader, setAuthHeader] = useState<string | null>(() => readSessionValue(AUTH_KEY));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<number | "new">("new");
  const [blogDraft, setBlogDraft] = useState<BlogPostItem>(emptyBlogPost());
  const [blogTagInput, setBlogTagInput] = useState("");
  const [blogMediaFile, setBlogMediaFile] = useState<File | null>(null);

  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [selectedEducationId, setSelectedEducationId] = useState<number | "new">("new");
  const [educationDraft, setEducationDraft] = useState<EducationItem>(emptyEducation());
  const [educationImageFile, setEducationImageFile] = useState<File | null>(null);
  const [educationVideoFile, setEducationVideoFile] = useState<File | null>(null);

  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [educationRegistrations, setEducationRegistrations] = useState<EducationRegistration[]>([]);
  const [consultationBookings, setConsultationBookings] = useState<ConsultationBooking[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authHeader) {
      return;
    }

    void bootstrapAdmin(authHeader);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeader]);

  const currentRequestItems = useMemo(() => {
    if (requestTab === "feedback") {
      return feedbackRequests;
    }
    if (requestTab === "educationRegistrations") {
      return educationRegistrations;
    }
    return consultationBookings;
  }, [requestTab, feedbackRequests, educationRegistrations, consultationBookings]);

  const requestColumns = useMemo(() => REQUEST_COLUMNS[requestTab], [requestTab]);

  async function adminFetch<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
    const isFormData = init.body instanceof FormData;
    const response = await fetch(`${ADMIN_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Basic ${token}`,
        "Accept-Language": uiLang,
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...(init.headers || {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  async function bootstrapAdmin(token: string) {
    try {
      setLoading(true);
      setError(null);

      const user = await adminFetch<AdminUser>("/me/", token);
      setAdminUser(user);
      await Promise.all([loadBlogPosts(token), loadEducationItems(token), loadRequests(token)]);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAuthError(err: unknown) {
    setAdminUser(null);
    setAuthHeader(null);
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(USERNAME_KEY);
    setError(err instanceof Error ? toReadableApiError(err.message, t.status.authorizationFailed, uiLang) : t.status.authorizationFailed);
  }

  async function onLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      const token = btoa(`${username}:${password}`);
      await adminFetch<AdminUser>("/me/", token);
      setAuthHeader(token);
      window.sessionStorage.setItem(AUTH_KEY, token);
      window.sessionStorage.setItem(USERNAME_KEY, username);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? toReadableApiError(err.message, t.status.loginFailed, uiLang) : t.status.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAdminUser(null);
    setAuthHeader(null);
    setPassword("");
    setError(null);
    setSuccess(null);
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(USERNAME_KEY);
  }

  async function loadBlogPosts(token: string) {
    const data = await adminFetch<BlogPostItem[]>("/content/blog-posts/", token);
    setBlogPosts(data);
    setSelectedBlogId("new");
    setBlogDraft(emptyBlogPost());
    setBlogTagInput("");
    setBlogMediaFile(null);
  }

  async function loadEducationItems(token: string) {
    const data = await adminFetch<EducationItem[]>("/content/education-items/", token);
    setEducationItems(data);
    setSelectedEducationId("new");
    setEducationDraft(emptyEducation());
    setEducationImageFile(null);
    setEducationVideoFile(null);
  }

  async function loadRequests(token: string) {
    const [feedback, registrations, bookings] = await Promise.all([
      adminFetch<FeedbackRequest[]>("/requests/feedback/", token),
      adminFetch<EducationRegistration[]>("/requests/education-registrations/", token),
      adminFetch<ConsultationBooking[]>("/requests/consultation-bookings/", token),
    ]);

    setFeedbackRequests(feedback);
    setEducationRegistrations(registrations);
    setConsultationBookings(bookings);
  }

  function selectBlog(id: number | "new") {
    setSelectedBlogId(id);
    setBlogTagInput("");
    setBlogMediaFile(null);
    if (id === "new") {
      setBlogDraft(emptyBlogPost());
      return;
    }

    const match = blogPosts.find((item) => item.id === id);
    if (!match) {
      return;
    }

    setBlogDraft(match);
  }

  function addBlogTag() {
    const normalized = blogTagInput.trim();
    if (!normalized) {
      return;
    }

    setBlogDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(normalized) ? prev.tags : [...prev.tags, normalized],
    }));
    setBlogTagInput("");
  }

  function removeBlogTag(tagToRemove: string) {
    setBlogDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }

  async function uploadBlogEditorImage(file: File): Promise<string> {
    if (!authHeader) {
      throw new Error(t.status.authorizationFailed);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await adminFetch<{ url: string }>("/content/blog-assets/", authHeader, {
        method: "POST",
        body: formData,
      });
      return response.url;
    } catch (err) {
      const message = err instanceof Error
        ? toReadableApiError(err.message, t.status.failedToUploadBlogImage, uiLang)
        : t.status.failedToUploadBlogImage;
      throw new Error(message);
    }
  }

  function selectEducation(id: number | "new") {
    setSelectedEducationId(id);
    setEducationImageFile(null);
    setEducationVideoFile(null);
    if (id === "new") {
      setEducationDraft(emptyEducation());
      return;
    }
    const match = educationItems.find((item) => item.id === id);
    if (match) {
      setEducationDraft(match);
    }
  }

  function updateEducationProgram(index: number, field: keyof EducationModuleItem, value: string | number) {
    setEducationDraft((prev) => {
      const updatedProgram = [...prev.program];
      const current = updatedProgram[index];
      updatedProgram[index] = {
        ...current,
        [field]: value,
      };
      return {
        ...prev,
        program: updatedProgram,
      };
    });
  }

  function addProgramModule() {
    setEducationDraft((prev) => ({
      ...prev,
      program: [
        ...prev.program,
        {
          sort_order: prev.program.length,
          title_ru: "",
          title_bg: "",
          description_ru: "",
          description_bg: "",
        },
      ],
    }));
  }

  function removeProgramModule(index: number) {
    setEducationDraft((prev) => ({
      ...prev,
      program: prev.program.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function saveBlogPost() {
    if (!authHeader) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: BlogPostItem = { ...blogDraft };

      const method = payload.id ? "PUT" : "POST";
      const path = payload.id ? `/content/blog-posts/${payload.id}/` : "/content/blog-posts/";
      const formData = new FormData();

      formData.append("slug", payload.slug);
      formData.append("author", payload.author);
      formData.append("tags", JSON.stringify(payload.tags));
      formData.append("published_at", payload.published_at);
      formData.append("title_ru", payload.title_ru);
      formData.append("title_bg", payload.title_bg);
      formData.append("content_ru", payload.content_ru);
      formData.append("content_bg", payload.content_bg);
      formData.append("is_published", String(payload.is_published));

      if (blogMediaFile) {
        formData.append("media_file", blogMediaFile);
      }

      await adminFetch(path, authHeader, {
        method,
        body: formData,
      });

      await loadBlogPosts(authHeader);
      setSuccess(t.status.blogPostSaved);
    } catch (err) {
      if (err instanceof Error) {
        setError(toReadableApiError(err.message, t.status.failedToSaveBlogPost, uiLang));
      } else {
        setError(t.status.failedToSaveBlogPost);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteBlogPost() {
    if (!authHeader || !blogDraft.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminFetch(`/content/blog-posts/${blogDraft.id}/`, authHeader, {
        method: "DELETE",
      });
      await loadBlogPosts(authHeader);
      setSuccess(t.status.blogPostDeleted);
    } catch (err) {
      setError(err instanceof Error ? toReadableApiError(err.message, t.status.failedToDeleteBlogPost, uiLang) : t.status.failedToDeleteBlogPost);
    } finally {
      setLoading(false);
    }
  }

  async function saveEducationItem() {
    if (!authHeader) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: EducationItem = {
        ...educationDraft,
        program: educationDraft.program.map((moduleItem, index) => ({
          ...moduleItem,
          sort_order: index,
        })),
      };

      const method = payload.id ? "PUT" : "POST";
      const path = payload.id ? `/content/education-items/${payload.id}/` : "/content/education-items/";
      const formData = new FormData();

      formData.append("item_type", payload.item_type);
      formData.append("slug", payload.slug);
      formData.append("image_src", payload.image_src || "");
      formData.append("video_src", payload.video_src || "");
      formData.append("title_ru", payload.title_ru);
      formData.append("title_bg", payload.title_bg);
      formData.append("description_ru", payload.description_ru);
      formData.append("description_bg", payload.description_bg);
      formData.append("start_date", payload.start_date);
      formData.append("price", payload.price);
      formData.append("level", payload.level);
      formData.append("goal", payload.goal);
      formData.append("item_format", payload.item_format);
      formData.append("is_published", String(payload.is_published));
      formData.append("program", JSON.stringify(payload.program));

      if (educationImageFile) {
        formData.append("image_file", educationImageFile);
      }

      if (educationVideoFile) {
        formData.append("video_file", educationVideoFile);
      }

      await adminFetch(path, authHeader, {
        method,
        body: formData,
      });

      await loadEducationItems(authHeader);
      setSuccess(t.status.educationItemSaved);
    } catch (err) {
      setError(err instanceof Error ? toReadableApiError(err.message, t.status.failedToSaveEducationItem, uiLang) : t.status.failedToSaveEducationItem);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEducationItem() {
    if (!authHeader || !educationDraft.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminFetch(`/content/education-items/${educationDraft.id}/`, authHeader, {
        method: "DELETE",
      });
      await loadEducationItems(authHeader);
      setSuccess(t.status.educationItemDeleted);
    } catch (err) {
      setError(err instanceof Error ? toReadableApiError(err.message, t.status.failedToDeleteEducationItem, uiLang) : t.status.failedToDeleteEducationItem);
    } finally {
      setLoading(false);
    }
  }

  if (!adminUser) {
    return (
      <section className={`${styles.wrapper} ${styles.authWrapper} adminFullBleed`}>
        <div className={styles.authCard}>
          <h1>{t.loginTitle}</h1>
          <form onSubmit={onLoginSubmit} className={styles.authForm}>
            <label>
              {t.usernameLabel}
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={t.usernamePlaceholder}
                autoComplete="username"
                required
              />
            </label>

            <label>
              {t.passwordLabel}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.passwordPlaceholder}
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? t.signingIn : t.signIn}
            </button>
          </form>

          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.wrapper} adminFullBleed`}>
      <div className={styles.topBar}>
        <div className={styles.titleWithLogo}>
          <Logo />
          <h1>{t.adminTitle}</h1>
        </div>

        <div className={styles.userBox}>
          <span>{adminUser.username}</span>
          <button className={styles.secondaryButton} onClick={logout} type="button">
            {t.logOut}
          </button>
        </div>
      </div>

      <nav className={styles.tabs}>
        <button className={tab === "blog" ? styles.activeTab : ""} onClick={() => setTab("blog")} type="button">
          {t.tabs.blog}
        </button>
        <button className={tab === "education" ? styles.activeTab : ""} onClick={() => setTab("education")} type="button">
          {t.tabs.education}
        </button>
        <button className={tab === "requests" ? styles.activeTab : ""} onClick={() => setTab("requests")} type="button">
          {t.tabs.requests}
        </button>
      </nav>

      {error ? <p className={styles.error}>{error}</p> : null}
      {success ? <p className={styles.success}>{success}</p> : null}

      {tab === "blog" ? (
        <div className={styles.grid}>
          <aside className={styles.listCard}>
            <div className={styles.sectionHeader}>
              <h2>{t.blog.title}</h2>
              <button type="button" onClick={() => selectBlog("new")} className={styles.secondaryButton}>
                {t.common.new}
              </button>
            </div>
            <ul>
              {blogPosts.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={selectedBlogId === item.id ? styles.selectedListItem : ""}
                    onClick={() => selectBlog(item.id as number)}
                  >
                    {item.slug}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.formCard}>
            <h2>{blogDraft.id ? t.common.editBlogPost : t.common.createBlogPost}</h2>
            <div className={styles.formGridThree}>
              <label>
                {t.blog.slug}
                <input value={blogDraft.slug} onChange={(event) => setBlogDraft({ ...blogDraft, slug: event.target.value })} />
              </label>
              <label>
                {t.blog.author}
                <input
                  value={blogDraft.author}
                  onChange={(event) => setBlogDraft({ ...blogDraft, author: event.target.value })}
                />
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                {t.blog.date}
                <input
                  type="date"
                  value={blogDraft.published_at}
                  onChange={(event) => setBlogDraft({ ...blogDraft, published_at: event.target.value })}
                />
              </label>
              <label>
                {t.blog.published}
                <select
                  value={String(blogDraft.is_published)}
                  onChange={(event) =>
                    setBlogDraft({ ...blogDraft, is_published: event.target.value === "true" })
                  }
                >
                  <option value="true">{t.common.yes}</option>
                  <option value="false">{t.common.no}</option>
                </select>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                {t.blog.titleRu}
                <input
                  value={blogDraft.title_ru}
                  onChange={(event) => setBlogDraft({ ...blogDraft, title_ru: event.target.value })}
                />
              </label>
              <label>
                {t.blog.titleBg}
                <input
                  value={blogDraft.title_bg}
                  onChange={(event) => setBlogDraft({ ...blogDraft, title_bg: event.target.value })}
                />
              </label>
            </div>

            <label>
              {t.blog.coverImage}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setBlogMediaFile(event.target.files?.[0] || null)}
              />
            </label>

            <div className={styles.tagEditor}>
              <label>
                {t.blog.tags}
                <div className={styles.tagInputRow}>
                  <input
                    value={blogTagInput}
                    placeholder={t.blog.tagPlaceholder}
                    onChange={(event) => setBlogTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addBlogTag();
                      }
                    }}
                  />
                  <button type="button" className={styles.secondaryButton} onClick={addBlogTag}>
                    + {t.blog.addTag}
                  </button>
                </div>
              </label>

              <div className={styles.tagList}>
                {blogDraft.tags.length > 0 ? (
                  blogDraft.tags.map((tag) => (
                    <span key={tag} className={styles.tagChip}>
                      {tag}
                      <button type="button" onClick={() => removeBlogTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className={styles.emptyHint}>{t.blog.noTags}</span>
                )}
              </div>
            </div>

            <RichTextEditor
              label={t.blog.contentRu}
              value={blogDraft.content_ru}
              onChange={(content) => setBlogDraft((prev) => ({ ...prev, content_ru: content }))}
              onUploadImage={uploadBlogEditorImage}
              onError={(message) => setError(message)}
            />

            <RichTextEditor
              label={t.blog.contentBg}
              value={blogDraft.content_bg}
              onChange={(content) => setBlogDraft((prev) => ({ ...prev, content_bg: content }))}
              onUploadImage={uploadBlogEditorImage}
              onError={(message) => setError(message)}
            />

            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={saveBlogPost} disabled={loading}>
                {loading ? t.status.savingBlogPost : t.common.save}
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={deleteBlogPost}
                disabled={loading || !blogDraft.id}
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "education" ? (
        <div className={styles.grid}>
          <aside className={styles.listCard}>
            <div className={styles.sectionHeader}>
              <h2>{t.education.title}</h2>
              <button type="button" onClick={() => selectEducation("new")} className={styles.secondaryButton}>
                {t.common.new}
              </button>
            </div>
            <ul>
              {educationItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={selectedEducationId === item.id ? styles.selectedListItem : ""}
                    onClick={() => selectEducation(item.id as number)}
                  >
                    {item.slug}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.formCard}>
            <h2>{educationDraft.id ? t.common.editEducationItem : t.common.createEducationItem}</h2>
            <div className={styles.formGridThree}>
              <label>
                {t.education.type}
                <select
                  value={educationDraft.item_type}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      item_type: event.target.value as EducationItem["item_type"],
                    })
                  }
                >
                  <option value="course">{t.education.typeCourse}</option>
                  <option value="webinar">{t.education.typeWebinar}</option>
                </select>
              </label>
              <label>
                {t.education.published}
                <select
                  value={String(educationDraft.is_published)}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      is_published: event.target.value === "true",
                    })
                  }
                >
                  <option value="true">{t.common.yes}</option>
                  <option value="false">{t.common.no}</option>
                </select>
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                {t.education.slug}
                <input
                  value={educationDraft.slug}
                  onChange={(event) => setEducationDraft({ ...educationDraft, slug: event.target.value })}
                />
              </label>
              <label>
                {t.education.image}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setEducationImageFile(event.target.files?.[0] || null)}
                />
              </label>
              <label>
                {t.education.video}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setEducationVideoFile(event.target.files?.[0] || null)}
                  disabled={educationDraft.item_type !== "webinar"}
                />
              </label>
            </div>

            {educationDraft.item_type === "webinar" && educationDraft.video_src ? (
              <label>
                {t.education.currentVideo}
                <a href={resolveAdminAssetUrl(educationDraft.video_src)} target="_blank" rel="noreferrer">
                  {resolveAdminAssetUrl(educationDraft.video_src)}
                </a>
              </label>
            ) : null}

            <div className={styles.formGrid}>
              <label>
                {t.education.titleRu}
                <input
                  value={educationDraft.title_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, title_ru: event.target.value })
                  }
                />
              </label>
              <label>
                {t.education.titleBg}
                <input
                  value={educationDraft.title_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, title_bg: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                {t.education.descriptionRu}
                <textarea
                  value={educationDraft.description_ru}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, description_ru: event.target.value })
                  }
                />
              </label>
              <label>
                {t.education.descriptionBg}
                <textarea
                  value={educationDraft.description_bg}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, description_bg: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                {t.education.startDate}
                <input
                  type="date"
                  value={educationDraft.start_date}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, start_date: event.target.value })
                  }
                />
              </label>
              <label>
                {t.education.price}
                <input
                  value={educationDraft.price}
                  onChange={(event) =>
                    setEducationDraft({ ...educationDraft, price: event.target.value })
                  }
                />
              </label>
              <label>
                {t.education.level}
                <select
                  value={educationDraft.level}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      level: event.target.value as EducationItem["level"],
                    })
                  }
                >
                  <option value="beginner">{t.education.levelBeginner}</option>
                  <option value="experienced">{t.education.levelExperienced}</option>
                  <option value="business">{t.education.levelBusiness}</option>
                </select>
              </label>
              <label>
                {t.education.goal}
                <select
                  value={educationDraft.goal}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      goal: event.target.value as EducationItem["goal"],
                    })
                  }
                >
                  <option value="launch">{t.education.goalLaunch}</option>
                  <option value="taxes">{t.education.goalTaxes}</option>
                  <option value="profession">{t.education.goalProfession}</option>
                  <option value="optimization">{t.education.goalOptimization}</option>
                </select>
              </label>
            </div>

            <div className={styles.formGridThree}>
              <label>
                {t.education.format}
                <select
                  value={educationDraft.item_format}
                  onChange={(event) =>
                    setEducationDraft({
                      ...educationDraft,
                      item_format: event.target.value as EducationItem["item_format"],
                    })
                  }
                >
                  <option value="online">{t.education.formatOnline}</option>
                  <option value="live">{t.education.formatLive}</option>
                  <option value="offline">{t.education.formatOffline}</option>
                </select>
              </label>
            </div>

            <div className={styles.programBlock}>
              <div className={styles.sectionHeader}>
                <h3>{t.education.programModules}</h3>
                <button type="button" className={styles.secondaryButton} onClick={addProgramModule}>
                  {t.education.addModule}
                </button>
              </div>

              {educationDraft.program.length === 0 ? <p>{t.education.noModulesYet}</p> : null}

              {educationDraft.program.map((moduleItem, index) => (
                <div key={index} className={styles.programItem}>
                  <div className={styles.formGrid}>
                    <label>
                      {t.education.titleRuModule}
                      <input
                        value={moduleItem.title_ru}
                        onChange={(event) =>
                          updateEducationProgram(index, "title_ru", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {t.education.titleBgModule}
                      <input
                        value={moduleItem.title_bg}
                        onChange={(event) =>
                          updateEducationProgram(index, "title_bg", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      {t.education.descriptionRuModule}
                      <textarea
                        value={moduleItem.description_ru}
                        onChange={(event) =>
                          updateEducationProgram(index, "description_ru", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {t.education.descriptionBgModule}
                      <textarea
                        value={moduleItem.description_bg}
                        onChange={(event) =>
                          updateEducationProgram(index, "description_bg", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className={styles.linkDanger}
                    onClick={() => removeProgramModule(index)}
                  >
                    {t.education.removeModule}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={saveEducationItem} disabled={loading}>
                {loading ? t.status.savingEducationItem : t.common.save}
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={deleteEducationItem}
                disabled={loading || !educationDraft.id}
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "requests" ? (
        <div className={styles.requestsCard}>
          <div className={styles.sectionHeader}>
            <h2>{t.requests.title}</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => authHeader && void loadRequests(authHeader)}
            >
              {t.requests.refresh}
            </button>
          </div>

          <div className={styles.requestsTabs}>
            <button
              className={requestTab === "feedback" ? styles.activeTab : ""}
              onClick={() => setRequestTab("feedback")}
              type="button"
            >
              {t.requests.feedback} ({feedbackRequests.length})
            </button>
            <button
              className={requestTab === "educationRegistrations" ? styles.activeTab : ""}
              onClick={() => setRequestTab("educationRegistrations")}
              type="button"
            >
              {t.requests.education} ({educationRegistrations.length})
            </button>
            <button
              className={requestTab === "consultationBookings" ? styles.activeTab : ""}
              onClick={() => setRequestTab("consultationBookings")}
              type="button"
            >
              {t.requests.consultations} ({consultationBookings.length})
            </button>
          </div>

          {currentRequestItems.length === 0 ? (
            <p>{t.requests.noRecordsYet}</p>
          ) : (
            <div className={styles.requestsTableWrap}>
              <table className={styles.requestsTable}>
                <thead>
                  <tr>
                    {requestColumns.map((column) => (
                      <th key={column.key}>{uiLang === "bg" ? column.label_bg : column.label_ru}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRequestItems.map((item) => (
                    <tr key={item.id}>
                      {requestColumns.map((column) => (
                        <td
                          key={`${item.id}-${column.key}`}
                          className={column.key === "message" ? styles.multilineCell : ""}
                        >
                          {formatRequestCell(item, column.key, language === "bg" ? "bg-BG" : "ru-RU")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
