"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { translations } from "./HelpChat.translations";
import styles from "./HelpChat.module.scss";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

export const HelpChat = () => {
  const { t } = useTranslation(translations);

  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      { id: 1, role: "bot", text: t.initialMessages[0] },
      { id: 2, role: "bot", text: t.initialMessages[1] },
    ],
    [t]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const canSend = useMemo(() => inputValue.trim().length > 0, [inputValue]);

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user", text: clean },
      {
        id: prev.length + 2,
        role: "bot",
        text: t.demoReply,
      },
    ]);

    setInputValue("");
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
              ✕
            </button>
          </header>

          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageBubble} ${
                  message.role === "user" ? styles.userBubble : styles.botBubble
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className={styles.quickReplies}>
            {t.quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                className={styles.quickReplyBtn}
                onClick={() => sendMessage(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            className={styles.composer}
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(inputValue);
            }}
          >
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

      <button
        type="button"
        className={styles.fab}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t.closeChatAriaLabel : t.openChatAriaLabel}
      >
        {isOpen ? t.close : t.open}
      </button>
    </div>
  );
};
