import type { Metadata } from 'next';
import { Oswald, Source_Sans_3 } from 'next/font/google';
import '@/styles/globals.scss';

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Olena Shopova',
  description: 'Olena Shopova - consultant, trainer, business coach',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='bg' className={`${oswald.variable} ${sourceSans.variable}`} data-scroll-behavior='smooth'>
      <body>{children}</body>
    </html>
  );
}