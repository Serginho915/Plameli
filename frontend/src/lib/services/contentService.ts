import { apiClient } from "@/lib/apiClient";
import type { BlogPost, ContentPageData, EducationItem } from "@/types/content";

interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  author: string;
  date: string;
  media_src: string;
  content: string[] | string | null;
}

interface ApiContentPage {
  slug: string;
  title: string;
  content: string;
}

interface ApiEducationModule {
  title: string;
  description: string;
}

interface ApiEducationItem {
  id: string;
  slug: string;
  type: "image" | "video";
  media_src: string;
  poster: string;
  title: string;
  startDate: string;
  format: string;
  price: string;
  level: string;
  goal: string;
  description: string;
  levelLabel: string;
  goalLabel: string;
  formatLabel: string;
  program: ApiEducationModule[];
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value
      .split(/\n{2,}|\r\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeLang(lang: string): "ru" | "bg" {
  return lang === "ru" ? "ru" : "bg";
}

function withLang(endpoint: string, lang: string): string {
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}lang=${normalizeLang(lang)}`;
}

function isNotFoundError(err: unknown): boolean {
  return err instanceof Error && err.message.includes("404");
}

function mapBlogPost(item: ApiBlogPost): BlogPost {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    tags: normalizeStringArray(item.tags),
    author: item.author,
    date: item.date,
    mediaSrc: item.media_src,
    content: normalizeStringArray(item.content),
  };
}

function mapEducationItem(item: ApiEducationItem): EducationItem {
  const safeFormat = typeof item.format === "string" ? item.format : "";

  return {
    id: item.id,
    slug: item.slug,
    type: item.type,
    mediaSrc: item.media_src,
    poster: item.poster || undefined,
    title: item.title,
    startDate: item.startDate,
    format: safeFormat,
    price: item.price,
    level: item.level,
    goal: item.goal,
    description: item.description,
    levelLabel: item.levelLabel,
    goalLabel: item.goalLabel,
    formatLabel: item.formatLabel,
    program: item.program,
  };
}

export async function getBlogPosts(lang: string): Promise<BlogPost[]> {
  const data = await apiClient<ApiBlogPost[]>(withLang("/content/blog/posts/", lang));
  return data.map(mapBlogPost);
}

export async function getBlogPost(slug: string, lang: string): Promise<BlogPost | null> {
  try {
    const data = await apiClient<ApiBlogPost>(withLang(`/content/blog/posts/${slug}/`, lang));
    return mapBlogPost(data);
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}

export async function getEducationItems(lang: string): Promise<EducationItem[]> {
  const data = await apiClient<ApiEducationItem[]>(withLang("/content/education/items/", lang));
  return data.map(mapEducationItem);
}

export async function getEducationItem(slug: string, lang: string): Promise<EducationItem | null> {
  try {
    const data = await apiClient<ApiEducationItem>(withLang(`/content/education/items/${slug}/`, lang));
    return mapEducationItem(data);
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}

export async function getContentPages(lang: string): Promise<ContentPageData[]> {
  return apiClient<ApiContentPage[]>(withLang("/content/pages/", lang));
}

export async function getContentPage(slug: string, lang: string): Promise<ContentPageData | null> {
  try {
    return await apiClient<ApiContentPage>(withLang(`/content/pages/${slug}/`, lang));
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}