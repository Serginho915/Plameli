import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import "@/styles/globals.scss";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Olena Shopova",
  description: "Olena Shopova - consultant, trainer, business coach",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { UIProvider } from "@/context/UIContext";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { BookingModal } from "@/components/ui/BookingModal/BookingModal";
import { i18n } from "@/i18n-config";
import { Language } from "@/types/language";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const currentLang = lang as Language;

  return (
    <html lang={lang} className={`${oswald.variable} ${sourceSans.variable}`} data-scroll-behavior="smooth">
      <body >
        <LanguageProvider initialLang={currentLang}>
          <UIProvider>
            <Header />
            <main className='main-flex'>
              {children}
            </main>
            <Footer />
            <BookingModal />
          </UIProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
