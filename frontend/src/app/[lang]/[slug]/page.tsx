import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}`);
}
