import { ConsultationHero } from "@/components/sections/ConsultationPage/Hero/ConsultationHero.tsx";
import { ForWhom } from "@/components/sections/ConsultationPage/ForWhom/ForWhom.tsx";
import { Problems } from "@/components/sections/ConsultationPage/Problems/Problems.tsx";

export default function ConsultationPage() {
  return (
    <>
      <ConsultationHero />
      <ForWhom />
      <Problems />
    </>
  );
}
