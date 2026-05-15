import { ConsultationHero } from "@/components/sections/ConsultationPage/Hero/ConsultationHero.tsx";
import { ForWhom } from "@/components/sections/ConsultationPage/ForWhom/ForWhom.tsx";
import { Problems } from "@/components/sections/ConsultationPage/Problems/Problems.tsx";
import { Stages } from "@/components/sections/ConsultationPage/Stages/Stages.tsx";
import { GettingReady } from "@/components/sections/ConsultationPage/GettingReady/GettingReady.tsx";
import { FAQ } from "@/components/sections/FAQ/FAQ";

export default function ConsultationPage() {
  return (
    <>
      <ConsultationHero />
      <ForWhom />
      <Problems />
      <Stages />
      <GettingReady />
      <FAQ />
    </>
  );
}
