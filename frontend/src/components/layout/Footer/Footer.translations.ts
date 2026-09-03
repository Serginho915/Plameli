import { ComponentTranslations } from "@/hooks/useTranslation";

export interface FooterTranslations {
  privacyPolicy: string;
  cookies: string;
  paymentsRefunds: string;
  termsOfService: string;
  copyright: string;
}

export const translations: ComponentTranslations<FooterTranslations> = {
  ru: {
    privacyPolicy: "Политика конфиденциальности",
    cookies: "Cookies",
    paymentsRefunds: "Оплата и возврат",
    termsOfService: "Условия обслуживания",
    copyright: "© 2026 Plameli. Все права защищены.",
  },
  bg: {
    privacyPolicy: "Политика за поверителност",
    cookies: "Бисквитки",
    paymentsRefunds: "Плащания и възстановявания",
    termsOfService: "Общи условия",
    copyright: "© 2026 Plameli. Всички права запазени.",
  },
};
