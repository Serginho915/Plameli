import type { Metadata } from "next";
import { EducationListing } from "@/components/sections/EducationPage/EducationListing/EducationListing.tsx";
import { Feedback } from "@/components/sections/Feedback/Feedback.tsx";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://plameli.com";

const metaByLang: Record<string, { title: string; description: string }> = {
  bg: {
    title: "Обучения",
    description:
      "Курсове и уебинари по счетоводство, данъчно облагане и финансов анализ в България. Онлайн и офлайн обучения от Олена Шопова за начинаещи и професионалисти.",
  },
  ru: {
    title: "Обучение",
    description:
      "Курсы и вебинары по бухгалтерии, налогообложению и финансовому анализу в Болгарии. Онлайн и офлайн обучение от Олены Шоповой для начинающих и профессионалов.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = metaByLang[lang] || metaByLang.bg;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/education`,
      languages: {
        bg: "/bg/education",
        ru: "/ru/education",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/${lang}/education`,
      type: "website",
    },
  };
}

export default function EducationPage() {
  return (
    <>
      <EducationListing />
      <Feedback />
    </>
  );
}
