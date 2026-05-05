import { Hero } from '@/components/sections/HomePage/Hero/Hero.tsx';
import { Stats } from '@/components/sections/HomePage/Stats/Stats.tsx';
import { Services } from '@/components/sections/HomePage/Services/Services.tsx';
import { Reviews } from '@/components/sections/HomePage/Reviews/Reviews.tsx';
import { Blog } from '@/components/sections/HomePage/Blog/Blog';


export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Reviews />
      <Blog />
    </>
  );
}
