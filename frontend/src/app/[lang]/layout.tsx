import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Olena Shopova',
  description: 'Olena Shopova - consultant, trainer, business coach',
};

<<<<<<< HEAD
import { LanguageProvider } from '@/context/LanguageContext';
import { UIProvider } from '@/context/UIContext';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { i18n } from '@/i18n-config';
import { Language } from '@/types/language';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
=======
import { LanguageProvider } from "@/context/LanguageContext";
import { UIProvider } from "@/context/UIContext";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { BookingModal } from "@/components/ui/BookingModal/BookingModal";
import { i18n } from "@/i18n-config";
import { Language } from "@/types/language";
>>>>>>> 27529bf47543a498954ed3977ae4620b1f73eaf4

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
<<<<<<< HEAD
    <LanguageProvider initialLang={currentLang}>
      <UIProvider>
        <Header />
        <main className='main-flex'>{children}</main>
        <Footer />
      </UIProvider>
    </LanguageProvider>
=======
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
>>>>>>> 27529bf47543a498954ed3977ae4620b1f73eaf4
  );
}
