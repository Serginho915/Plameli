'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { translations } from './page.translations';

export default function Home() {
  const { t } = useTranslation(translations);

  return (
    <div className="container">
      <h1>{t.welcome}</h1>
    </div>
  );
}
