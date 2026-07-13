import { ComponentTranslations } from "@/hooks/useTranslation";

export interface HelpChatTranslations {
  chatWindowAriaLabel: string;
  closeChatAriaLabel: string;
  openChatAriaLabel: string;
  title: string;
  subtitle: string;
  send: string;
  inputPlaceholder: string;
  initialMessage: string;
  loadingMessage: string;
  errorMessage: string;
}

export const translations: ComponentTranslations<HelpChatTranslations> = {
  ru: {
    chatWindowAriaLabel: "Окно чата поддержки",
    closeChatAriaLabel: "Закрыть чат поддержки",
    openChatAriaLabel: "Открыть чат поддержки",
    title: "Plameli",
    subtitle: "Онлайн ассистент",
    send: "Отправить",
    inputPlaceholder: "Напишите сообщение...",
    initialMessage: "Здравей! Аз съм асистентът. С какво да помогна днес? ",
    loadingMessage: "Пишу ответ...",
    errorMessage: "Сейчас ассистент недоступен. Проверьте ключ OpenRouter или попробуйте позже.",
  },
  bg: {
    chatWindowAriaLabel: "Прозорец за чат с поддръжка",
    closeChatAriaLabel: "Затвори чата",
    openChatAriaLabel: "Отвори чата",
    title: "Plameli",
    subtitle: "Онлайн асистент",
    send: "Изпрати",
    inputPlaceholder: "Напишете съобщение...",
    initialMessage: "Здравей! Аз съм асистентът. С какво да помогна днес? ",
    loadingMessage: "Пиша отговор...",
    errorMessage: "В момента асистентът не е достъпен. Проверете OpenRouter ключа или опитайте по-късно.",
  },
};
