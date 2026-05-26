import { Hero } from '@/components/sections/HomePage/Hero/Hero';
import { Stats } from '@/components/sections/HomePage/Stats/Stats';
import { Services } from '@/components/sections/HomePage/Services/Services';
import { Reviews } from '@/components/sections/HomePage/Reviews/Reviews';
import { Blog } from '@/components/sections/HomePage/Blog/Blog';
import { FAQ } from '@/components/sections/FAQ/FAQ';
import { Feedback } from '@/components/sections/Feedback/Feedback';


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
