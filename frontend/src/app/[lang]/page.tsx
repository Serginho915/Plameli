import { Hero } from '@/components/sections/HomePage/Hero/Hero.tsx';
import { Stats } from '@/components/sections/HomePage/Stats/Stats.tsx';
import { Services } from '@/components/sections/HomePage/Services/Services.tsx';


export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
    </>
  );
}
