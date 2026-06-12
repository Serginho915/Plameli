import { Hero } from '@/components/sections/HomePage/Hero/Hero';
import { Stats } from '@/components/sections/HomePage/Stats/Stats';
import { Services } from '@/components/sections/HomePage/Services/Services';
import { Reviews } from '@/components/sections/HomePage/Reviews/Reviews';
import { Blog } from '@/components/sections/HomePage/Blog/Blog';
import { FAQ } from '@/components/sections/FAQ/FAQ';
import { Feedback } from '@/components/sections/Feedback/Feedback';
import { i18n } from '@/i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}


export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Reviews />
      <Blog />
      <FAQ />
      <Feedback />
    </>
  );
}
