import { ComponentTranslations } from "@/hooks/useTranslation";

export interface HelpChatTranslations {
  chatWindowAriaLabel: string;
  closeChatAriaLabel: string;
  openChatAriaLabel: string;
  title: string;
  subtitle: string;
  close: string;
  open: string;
  send: string;
  inputPlaceholder: string;
  initialMessages: string[];
  quickReplies: string[];
  demoReply: string;
}

export const translations: ComponentTranslations<HelpChatTranslations> = {
  ru: {
    chatWindowAriaLabel: "Окно чата поддержки",
    closeChatAriaLabel: "Закрыть чат поддержки",
    openChatAriaLabel: "Открыть чат поддержки",
    title: "Plameli Support",
    subtitle: "Онлайн помощь",
    close: "Закрыть",
    open: "Помощь",
    send: "Отправить",
    inputPlaceholder: "Напишите сообщение...",
    initialMessages: [
      "Привет. Я бот поддержки Plameli. Помогу с консультациями, записью и обучением.",
      "Напишите вопрос или выберите одну из подсказок ниже.",
    ],
    quickReplies: [
      "Как записаться на консультацию?",
      "Какая стоимость услуг?",
      "Нужна помощь с выбором формата",
    ],
    demoReply:
      "Спасибо. Это демо-окно поддержки, здесь пока реализованы только стили. Логику можно подключить отдельно.",
  },
  bg: {
    chatWindowAriaLabel: "Прозорец за чат с поддръжка",
    closeChatAriaLabel: "Затвори чата за поддръжка",
    openChatAriaLabel: "Отвори чата за поддръжка",
    title: "Plameli Support",
    subtitle: "Онлайн помощ",
    close: "Затвори",
    open: "Помощ",
    send: "Изпрати",
    inputPlaceholder: "Напишете съобщение...",
    initialMessages: [
      "Здравейте. Аз съм ботът за поддръжка на Plameli. Ще помогна с консултации, записване и обучения.",
      "Напишете въпрос или изберете една от подсказките по-долу.",
    ],
    quickReplies: [
      "Как да се запиша за консултация?",
      "Каква е цената на услугите?",
      "Нужна ми е помощ за избор на формат",
    ],
    demoReply:
      "Благодаря. Това е демо прозорец за поддръжка и тук засега са реализирани само стиловете. Логиката може да се добави отделно.",
  },
};
