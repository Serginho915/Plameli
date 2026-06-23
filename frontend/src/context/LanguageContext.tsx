'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode; initialLang: Language }> = ({ children, initialLang }) => {
  const [language, setLanguage] = useState<Language>(initialLang || 'bg');
  const [previousInitialLang, setPreviousInitialLang] = useState(initialLang);

  if (initialLang !== previousInitialLang) {
    setPreviousInitialLang(initialLang);
    setLanguage(initialLang);
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
