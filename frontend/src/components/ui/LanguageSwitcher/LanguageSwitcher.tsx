'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/translations';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  const langs: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'bg', label: 'Български' },
  ];

  return (
    <div className="language-switcher">
      <span className="switcher-label">{t('switch_lang')}:</span>
      <div className="switcher-buttons">
        {langs.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`switcher-btn ${language === lang.code ? 'is-active' : ''}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};
