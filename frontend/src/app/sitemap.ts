import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";
import { getMockBlogPosts } from "@/components/sections/BlogPage/BlogDetail/mockData";
import {
  getMockCourses,
  getMockWebinars,
} from "@/components/sections/EducationPage/EducationListing/mockData";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ledgerlab.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPages = ["", "/consultation", "/education"];

  for (const locale of i18n.locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      });
    }
  }

  // Blog posts per locale
  for (const locale of i18n.locales) {
    const posts = getMockBlogPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [
              l,
              `${BASE_URL}/${l}/blog/${post.slug}`,
            ])
          ),
        },
      });
    }
  }

  // Education pages per locale (courses + webinars)
  for (const locale of i18n.locales) {
    const courses = getMockCourses(locale);
    const webinars = getMockWebinars(locale);
    const allEducation = [...courses, ...webinars];

    for (const item of allEducation) {
      entries.push({
        url: `${BASE_URL}/${locale}/education/${item.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [
              l,
              `${BASE_URL}/${l}/education/${item.slug}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
