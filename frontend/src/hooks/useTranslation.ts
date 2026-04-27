'use client';

import { useLanguage } from '../context/LanguageContext';
import { Language } from '../translations';

export type ComponentTranslations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const useTranslation = (localTranslations?: ComponentTranslations) => {
  const { language, setLanguage, t: globalT } = useLanguage();

  /**
   * Scoped translation function
   * Priority: 1. Local language, 2. Local fallback (en), 3. Global translation, 4. Key itself
   */
  const t = (key: string): string => {
    if (localTranslations) {
      const local = localTranslations[language]?.[key] || localTranslations['en']?.[key];
      if (local) return local;
    }
    
    // Fallback to global translations (need cast because key is string)
    return globalT(key as any);
  };

  return { t, language, setLanguage };
};
