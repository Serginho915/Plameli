import type { Metadata } from "next";
import { ConsultationHero } from "@/components/sections/ConsultationPage/Hero/ConsultationHero";
import { ForWhom } from "@/components/sections/ConsultationPage/ForWhom/ForWhom";
import { Problems } from "@/components/sections/ConsultationPage/Problems/Problems";
import { Stages } from "@/components/sections/ConsultationPage/Stages/Stages";
import { GettingReady } from "@/components/sections/ConsultationPage/GettingReady/GettingReady";
import { TrainingCTA } from "@/components/sections/ConsultationPage/TrainingCTA/TrainingCTA";
import { FAQ } from "@/components/sections/FAQ/FAQ";
import { Feedback } from "@/components/sections/Feedback/Feedback";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ledgerlab.tech";

const metaByLang: Record<string, { title: string; description: string }> = {
  bg: {
    title: "Консултация",
    description:
      "Запишете се за финансова консултация с Олена Шопова. Индивидуален подход към счетоводството, данъчното планиране и оптимизацията на вашия бизнес в България.",
  },
  ru: {
    title: "Консультация",
    description:
      "Запишитесь на финансовую консультацию с Оленой Шоповой. Индивидуальный подход к бухгалтерии, налоговому планированию и оптимизации вашего бизнеса в Болгарии.",
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
      canonical: `/${lang}/consultation`,
      languages: {
        bg: "/bg/consultation",
        ru: "/ru/consultation",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/${lang}/consultation`,
      type: "website",
    },
  };
}

export default function ConsultationPage() {
  return (
    <>
      <ConsultationHero />
      <ForWhom />
      <Problems />
      <Stages />
      <GettingReady />
      <TrainingCTA />
      <FAQ />
      <Feedback />
    </>
  );
}
