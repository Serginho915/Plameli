"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./HelpChat.translations";
import styles from "./HelpChat.module.scss";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

type HelpChatResponse = {
  answer: string;
  sessionId?: string;
};

const CHAT_SESSION_KEY = "helpChat.sessionId";
const FOLLOW_UP_PATTERN =
  /([.!?])\s+((?:What|Which|How|Would|Tell|If|Что|Как|Какой|Какая|Какое|Какую|Хотите|Напишите|Если|Какво|Кой|Коя|Кое|Искате|Напишете|Ако)\b[^\n]*)$/i;

function formatChatText(text: string): string {
  const formatted = text
    .trim()
    .replace(/([:;])\s+-\s+/g, "$1\n- ")
    .replace(/[ \t]+\n/g, "\n");

  if (!formatted.includes("\n- ")) {
    return formatted;
  }

  return formatted
    .replace(FOLLOW_UP_PATTERN, "$1\n\n$2")
    .replace(/\n{3,}/g, "\n\n");
}

function readChatSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(CHAT_SESSION_KEY);
}

export const HelpChat = () => {
  const { t, language } = useTranslation(translations);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(() => readChatSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "initial-message", role: "bot", text: t.initialMessage },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const canSend = useMemo(
    () => inputValue.trim().length > 0 && !isLoading,
    [inputValue, isLoading]
  );
  const visibleMessages = useMemo(() => messages.slice(-7), [messages]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clean = inputValue.trim();
    if (!clean || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: clean,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await apiClient<HelpChatResponse>("/help-chat/", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          language,
          messages: nextMessages.map((message) => ({
            role: message.role === "bot" ? "assistant" : "user",
            content: message.text,
          })),
        }),
      });

      if (response.sessionId) {
        setSessionId(response.sessionId);
        window.sessionStorage.setItem(CHAT_SESSION_KEY, response.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          role: "bot",
          text: formatChatText(response.answer),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "bot",
          text: t.errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.helpChat}>
      {isOpen && (
        <section className={styles.chatWindow} aria-label={t.chatWindowAriaLabel}>
          <header className={styles.header}>
            <div>
              <p className={styles.title}>{t.title}</p>
              <p className={styles.subtitle}>{t.subtitle}</p>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label={t.closeChatAriaLabel}
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox="0 0 24 24" className={styles.closeIcon} aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className={styles.messages} aria-live="polite">
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageBubble} ${
                  message.role === "user" ? styles.userBubble : styles.botBubble
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                {t.loadingMessage}
              </div>
            )}
          </div>

          <form className={styles.composer} onSubmit={sendMessage}>
            <input
              className={styles.input}
              type="text"
              placeholder={t.inputPlaceholder}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit" className={styles.sendBtn} disabled={!canSend}>
              {t.send}
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => setIsOpen(true)}
          aria-label={t.openChatAriaLabel}
        >
          <svg viewBox="0 0 24 24" className={styles.fabIcon} aria-hidden="true">
            <path
              d="M4.5 12a7.5 7.5 0 0 1 7.5-7.5h0A7.5 7.5 0 0 1 19.5 12v0A7.5 7.5 0 0 1 12 19.5H9l-3.5 2 1.2-3.2A7.47 7.47 0 0 1 4.5 12Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="12" r="1.1" fill="currentColor" />
            <circle cx="12" cy="12" r="1.1" fill="currentColor" />
            <circle cx="15" cy="12" r="1.1" fill="currentColor" />
          </svg>
        </button>
      )}
    </div>
  );
};
