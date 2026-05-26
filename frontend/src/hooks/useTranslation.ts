'use client';

import { useLanguage } from '../context/LanguageContext.tsx';
import { Language } from '../types/language.ts';

export type ComponentTranslations<T extends Record<string, any> = Record<string, any>> = Record<Language, T>;

export function useTranslation<T extends Record<string, any>>(localTranslations?: ComponentTranslations<T>) {
  const { language, setLanguage } = useLanguage();

  // If localTranslations is provided, return the dictionary for the current language
  // Fallback to 'bg' if the current language dictionary is not available
  const t = localTranslations 
    ? (localTranslations[language] || localTranslations['bg']) 
    : ({} as T);

  return { t, language, setLanguage };
}
