import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/sections/BlogPage/BlogDetail/BlogDetail";
import { getBlogPost, getBlogPosts } from "@/lib/services/contentService";
import { i18n } from "@/i18n-config";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ledgerlab.tech";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getBlogPost(slug, lang);

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

export async function generateStaticParams() {
  const paths: { lang: string; slug: string }[] = [];

  await Promise.all(
    i18n.locales.map(async (locale) => {
      try {
        const posts = await getBlogPosts(locale);
        posts.forEach((post) => {
          paths.push({ lang: locale, slug: post.slug });
        });
      } catch {
        // Keep dynamic fallback working when API is unavailable at build time.
      }
    })
  );

  return paths;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  const [post, allPosts] = await Promise.all([
    getBlogPost(slug, lang),
    getBlogPosts(lang),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} allPosts={allPosts} language={lang} />;
}
