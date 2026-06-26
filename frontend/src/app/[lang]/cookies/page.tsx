import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage/LegalPage";
import { i18n } from "@/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ledgerlab.tech";

const content = {
  ru: {
    eyebrow: "Юридическая информация",
    title: "Cookies",
    updated: "Обновлено: 26 июня 2026 г.",
    description: "Как сайт ledgerlab.tech использует cookies и похожие технологии.",
    sections: [
      {
        title: "1. Что такое cookies",
        paragraphs: [
          "Cookies — это небольшие файлы или технические идентификаторы, которые сайт сохраняет в браузере, чтобы обеспечить работу функций, безопасность и корректную навигацию.",
        ],
      },
      {
        title: "2. Какие cookies мы используем",
        table: {
          headers: ["Категория", "Назначение", "Пример"],
          rows: [
            ["Необходимые", "Нужны для базовой работы сайта, форм, навигации и защиты запросов.", "Сессионные cookies, технические параметры языка и интерфейса."],
            ["Платежные", "Используются при переходе к Stripe Checkout и возврате после оплаты.", "Идентификаторы Checkout Session и параметры результата оплаты."],
            ["Сторонние", "Могут устанавливаться сервисами, с которыми вы взаимодействуете.", "Stripe для оплаты, Google-сервисы для календаря, встроенные внешние медиа при их использовании."],
          ],
        },
      },
      {
        title: "3. Аналитика и маркетинг",
        paragraphs: [
          "На момент обновления этой страницы сайт не использует отдельные рекламные cookies для поведенческого таргетинга. Если такие инструменты будут добавлены, эта политика будет обновлена.",
        ],
      },
      {
        title: "4. Как управлять cookies",
        paragraphs: [
          "Вы можете удалить или заблокировать cookies в настройках браузера. Если отключить необходимые cookies, отдельные функции сайта, формы или платежный процесс могут работать некорректно.",
        ],
      },
      {
        title: "5. Контакты",
        paragraphs: [
          "По вопросам использования cookies напишите нам на office@plameli.com.",
        ],
      },
    ],
  },
  bg: {
    eyebrow: "Правна информация",
    title: "Бисквитки",
    updated: "Актуализирано: 26 юни 2026 г.",
    description: "Как сайтът ledgerlab.tech използва бисквитки и сходни технологии.",
    sections: [
      {
        title: "1. Какво са бисквитките",
        paragraphs: [
          "Бисквитките са малки файлове или технически идентификатори, които сайтът съхранява в браузъра, за да осигури работа на функциите, сигурност и коректна навигация.",
        ],
      },
      {
        title: "2. Какви бисквитки използваме",
        table: {
          headers: ["Категория", "Цел", "Пример"],
          rows: [
            ["Необходими", "Нужни са за основната работа на сайта, формите, навигацията и защитата на заявките.", "Сесийни бисквитки, технически параметри за език и интерфейс."],
            ["Платежни", "Използват се при преминаване към Stripe Checkout и връщане след плащане.", "Идентификатори на Checkout Session и параметри за резултат от плащане."],
            ["Трети страни", "Могат да бъдат задавани от услуги, с които взаимодействате.", "Stripe за плащания, Google услуги за календар, вградени външни медии при използване."],
          ],
        },
      },
      {
        title: "3. Аналитика и маркетинг",
        paragraphs: [
          "Към момента на актуализиране на тази страница сайтът не използва отделни рекламни бисквитки за поведенческо таргетиране. Ако бъдат добавени такива инструменти, тази политика ще бъде актуализирана.",
        ],
      },
      {
        title: "4. Как да управлявате бисквитките",
        paragraphs: [
          "Можете да изтриете или блокирате бисквитките от настройките на браузъра. Ако изключите необходимите бисквитки, някои функции на сайта, формите или платежният процес може да не работят правилно.",
        ],
      },
      {
        title: "5. Контакти",
        paragraphs: [
          "За въпроси относно използването на бисквитки ни пишете на office@plameli.com.",
        ],
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = content[lang as keyof typeof content] || content.bg;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${lang}/cookies`,
      languages: {
        bg: "/bg/cookies",
        ru: "/ru/cookies",
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${BASE_URL}/${lang}/cookies`,
      type: "website",
    },
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const page = content[lang as keyof typeof content] || content.bg;

  return <LegalPage {...page} />;
}
