export const i18n = {
    defaultLocale: 'bg',
    locales: ['ru', 'bg'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
