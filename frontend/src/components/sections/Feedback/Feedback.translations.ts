import { ComponentTranslations } from "@/hooks/useTranslation.ts";

export interface FeedbackTranslations {
  title: string;
  contactsTitle: string;
  telegram: string;
  email: string;
  location: string;
  consultationBtn: string;
  consultationBtnMobile: string;
  formTitle: string;
  formSubtitle: string;
  formNamePlaceholder: string;
  formEmailPlaceholder: string;
  formQuestionPlaceholder: string;
  formSubmitBtn: string;
  euProjectInfo: string;
  privacyPolicy: string;
  cookies: string;
  paymentsRefunds: string;
  copyright: string;
}

export const translations: ComponentTranslations<FeedbackTranslations> = {
  ru: {
    title: "Обратная связь",
    contactsTitle: "Контакты",
    telegram: "OlenaShopovaManager",
    email: "email111@gmail.com",
    location: "София, Болгария",
    consultationBtn: "Записаться на консультацию",
    consultationBtnMobile: "Консультация",
    formTitle: "Остались Вопросы?",
    formSubtitle: "Напишите нам свой вопрос - мы ответим как можно скорее.",
    formNamePlaceholder: "Имя",
    formEmailPlaceholder: "Email",
    formQuestionPlaceholder: "Задайте вопрос",
    formSubmitBtn: "Отправить",
    euProjectInfo: "EU Project Information",
    privacyPolicy: "Privacy policy",
    cookies: "Cookies",
    paymentsRefunds: "Payments and refunds",
    copyright: "© 2026 Plamely. All rights reserved.",
  },
  bg: {
    title: "Обратна връзка",
    contactsTitle: "Контакти",
    telegram: "OlenaShopovaManager",
    email: "email111@gmail.com",
    location: "София, България",
    consultationBtn: "Запишете се за консултация",
    consultationBtnMobile: "Консултация",
    formTitle: "Останаха ли въпроси?",
    formSubtitle: "Напишете ни своя въпрос - ще отговорим възможно най-скоро.",
    formNamePlaceholder: "Име",
    formEmailPlaceholder: "Имейл",
    formQuestionPlaceholder: "Задайте въпрос",
    formSubmitBtn: "Изпрати",
    euProjectInfo: "EU Project Information",
    privacyPolicy: "Политика за поверителност",
    cookies: "Бисквитки",
    paymentsRefunds: "Плащания и възстановяване",
    copyright: "© 2026 Plamely. Всички права запазени.",
  },
};

export default translations;