import { ComponentTranslations } from "@/hooks/useTranslation";

export interface FooterTranslations {
  euProjectInfo: string;
  privacyPolicy: string;
  cookies: string;
  paymentsRefunds: string;
  termsOfService: string;
  copyright: string;
}

export const translations: ComponentTranslations<FooterTranslations> = {
  ru: {
    euProjectInfo: "BG16RFPR001-1.012-0189-C01",
    privacyPolicy: "Политика конфиденциальности",
    cookies: "Cookies",
    paymentsRefunds: "Оплата и возврат",
    termsOfService: "Условия обслуживания",
    copyright: "© 2026 Plameli. Все права защищены.",
  },
  bg: {
    euProjectInfo: "BG16RFPR001-1.012-0189-C01",
    privacyPolicy: "Политика за поверителност",
    cookies: "Бисквитки",
    paymentsRefunds: "Плащания и възстановявания",
    termsOfService: "Общи условия",
    copyright: "© 2026 Plameli. Всички права запазени.",
  },
};
