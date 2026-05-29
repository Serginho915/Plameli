import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/sections/BlogPage/BlogDetail/BlogDetail";
import {
  getMockBlogPost,
  getMockBlogPosts,
} from "@/components/sections/BlogPage/BlogDetail/mockData";
import { i18n } from "@/i18n-config";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ledgerlab.tech";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getMockBlogPost(slug, lang);

  if (!post) {
    return { title: "Not Found" };
  }

  const description = post.content[0]?.slice(0, 160) || post.title;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: {
        bg: `/bg/blog/${slug}`,
        ru: `/ru/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description,
      url: `${BASE_URL}/${lang}/blog/${slug}`,
      type: "article",
      images: post.mediaSrc ? [{ url: post.mediaSrc }] : undefined,
    },
  };
}

// Pre-generate paths for all mock posts at build time
// When switching to API: replace with `await fetchAllSlugs(locale)`
export async function generateStaticParams() {
  const paths: { lang: string; slug: string }[] = [];

  i18n.locales.forEach((locale) => {
    getMockBlogPosts(locale).forEach((post) => {
      paths.push({ lang: locale, slug: post.slug });
    });
  });

  return paths;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  // Data layer — currently mock, future: await fetchBlogPost(slug, lang)
  const post = getMockBlogPost(slug, lang);
  const allPosts = getMockBlogPosts(lang);

  // Redirect to 404 if slug doesn't exist in the data source
  if (!post) {
    notFound();
  }

  // Pass pre-fetched data as props — BlogDetail is a pure display component
  return <BlogDetail post={post} allPosts={allPosts} language={lang} />;
}
