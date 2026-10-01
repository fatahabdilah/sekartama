"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { contact } from "@/lib/site";
import styles from "./ChatWidget.module.css";

type Message = { role: "user" | "assistant"; content: string; failed?: boolean };

const GREETING: Message = {
  role: "assistant",
  content: "Halo! Saya Sekar, asisten AI resmi dari CV. SEKAR TAMA CONTRACTION yang siap membantu Anda.",
};
const FALLBACK = `Maaf, Sekar sedang tidak bisa menjawab. Silakan hubungi kami langsung via WhatsApp di ${contact.phone}.`;
const RATE_LIMITED = "Pesan Anda terlalu banyak dalam waktu singkat. Mohon tunggu sebentar lalu coba lagi.";
const MAX_INPUT_HEIGHT = 110;
const HISTORY_LIMIT = 20;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  function resizeInput() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    requestAnimationFrame(resizeInput);
    setLoading(true);

    // The greeting and failed replies are UI-only, so they're not sent to the model.
    const history = next
      .filter((m) => m !== GREETING && !m.failed)
      .slice(-HISTORY_LIMIT)
      .map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) {
        const content = res.status === 429 ? RATE_LIMITED : FALLBACK;
        setMessages((prev) => [...prev, { role: "assistant", content, failed: true }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: FALLBACK, failed: true }]);
    } finally {
      setLoading(false);
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  }

  return (
    <>
      {open && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="Chat dengan Sekar"
          onKeyDown={(event) => event.key === "Escape" && close()}
        >
          <div className={styles.header}>
            <Image src="/images/chat/sekar-42.svg" alt="" width={42} height={42} />
            <div className={styles.identity}>
              <p className={styles.name}>Sekar</p>
              <p className={styles.status}>
                <span className={styles.dot} />
                Online — siap membantu
              </p>
            </div>
            <button type="button" className={styles.close} aria-label="Tutup chat" onClick={close}>
              <Image src="/icons/chat-close.svg" alt="" width={18} height={18} />
            </button>
          </div>

          <div ref={listRef} className={styles.messages} aria-live="polite">
            {messages.map((message, i) =>
              message.role === "assistant" ? (
                <div key={i} className={styles.botRow}>
                  <Image src="/images/chat/sekar-30.svg" alt="" width={30} height={30} className={styles.avatar} />
                  <p className={`${styles.bubble} ${styles.bot}`}>{message.content}</p>
                </div>
              ) : (
                <div key={i} className={styles.userRow}>
                  <p className={`${styles.bubble} ${styles.user}`}>{message.content}</p>
                </div>
              ),
            )}
            {loading && (
              <div className={styles.botRow}>
                <Image src="/images/chat/sekar-30.svg" alt="" width={30} height={30} className={styles.avatar} />
                <p className={`${styles.bubble} ${styles.bot} ${styles.typing}`} aria-label="Sekar sedang mengetik">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            )}
          </div>

          <form className={styles.composer} onSubmit={send}>
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={1}
              value={input}
              maxLength={1000}
              placeholder="Ketik pesan Anda..."
              aria-label="Tulis pesan"
              onChange={(event) => {
                setInput(event.target.value);
                resizeInput();
              }}
              onKeyDown={onInputKeyDown}
            />
            <button type="submit" className={styles.send} aria-label="Kirim pesan" disabled={!input.trim() || loading}>
              <Image src="/icons/chat-send.svg" alt="" width={20} height={20} />
            </button>
          </form>

          <p className={styles.powered}>Powered by Google Gemini AI</p>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-label={open ? "Tutup chat Sekar" : "Buka chat Sekar"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Image src="/images/sekar-chat.svg" alt="" width={57.2} height={57.2} />
        {!open && <span className={styles.badge} />}
      </button>
    </>
  );
}
