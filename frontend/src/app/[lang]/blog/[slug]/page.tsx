import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/sections/BlogPage/BlogDetail/BlogDetail.tsx";
import {
  getMockBlogPost,
  getMockBlogPosts,
} from "@/components/sections/BlogPage/BlogDetail/mockData.ts";
import { i18n } from "@/i18n-config.ts";

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
