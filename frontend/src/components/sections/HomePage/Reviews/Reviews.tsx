import React from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from './Reviews.translations.ts';
export const Reviews = () => {
  const { t } = useTranslation(translations);
  return (
    <section>
         <SectionTitle text={t.title} />
    </section>
  )
}
