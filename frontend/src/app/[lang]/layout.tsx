import { LanguageProvider } from '@/context/LanguageContext';
import { UIProvider } from '@/context/UIContext';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { BookingModal } from '@/components/ui/BookingModal/BookingModal';
import { i18n } from '@/i18n-config';
import { Language } from '@/types/language';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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
    <LanguageProvider initialLang={currentLang}>
      <UIProvider>
        <Header />
        <main className='main-flex'>{children}</main>
        <Footer />
        <BookingModal />
      </UIProvider>
    </LanguageProvider>
  );
}
