import { ComponentTranslations } from "@/hooks/useTranslation.ts";

export interface FooterTranslations {
  euProjectInfo: string;
  privacyPolicy: string;
  cookies: string;
  paymentsRefunds: string;
  copyright: string;
}

export const translations: ComponentTranslations<FooterTranslations> = {
  ru: {
    euProjectInfo: "Информация о проекте ЕС",
    privacyPolicy: "Политика конфиденциальности",
    cookies: "Cookies",
    paymentsRefunds: "Оплата и возврат",
    copyright: "© 2026 Plameli. Все права защищены.",
  },
  bg: {
    euProjectInfo: "Информация за проект на ЕС",
    privacyPolicy: "Политика за поверителност",
    cookies: "Бисквитки",
    paymentsRefunds: "Плащания и възстановявания",
    copyright: "© 2026 Plameli. Всички права запазени.",
  },
};
