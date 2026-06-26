import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";
import { getBlogPosts, getEducationItems } from "@/lib/services/contentService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ledgerlab.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPages = ["", "/consultation", "/education", "/privacy-policy", "/cookies"];

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
    try {
      const posts = await getBlogPosts(locale);
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
    } catch {
      // Skip dynamic blog URLs when API is unavailable.
    }
  }

  // Education pages per locale (courses + webinars)
  for (const locale of i18n.locales) {
    try {
      const allEducation = await getEducationItems(locale);

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
    } catch {
      // Skip dynamic education URLs when API is unavailable.
    }
  }

  return entries;
}
