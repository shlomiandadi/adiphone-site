"use client";
import { useState, useRef, useEffect } from "react";
import ChatbotHoneypot from "./ChatbotHoneypot";
import { chatbotReplyText, chatbotRequestBody, readTurnstileToken } from "@/lib/chatbot/policy";

function RobotIcon() {
  return (
    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#010A26]">
      <img src="/icon-32.png" alt="" width={32} height={32} decoding="async" />
    </span>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatOpenedAtRef = useRef(0);

  useEffect(() => {
    chatOpenedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.slice(-6);
    setMessages((msgs) => [...msgs, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatbotRequestBody({
          message: text,
          history,
          openedAt: chatOpenedAtRef.current,
          company: honeypot,
          turnstileToken: readTurnstileToken(),
        })),
      });
      const data = await res.json().catch(() => null);
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", content: chatbotReplyText(data) },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", content: chatbotReplyText(null) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* כפתור עגול לפתיחת הצ'אט - מוסתר כי הפונקציונליות עברה ל-FloatingButtons */}
      {/* {!open && (
        <button
          className="fixed bottom-32 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 transition-all focus:outline-none border-4 border-white md:flex hidden"
          style={{ boxShadow: '0 4px 24px 0 #2563eb33' }}
          onClick={() => setOpen(true)}
          aria-label="התחל צ'אט AI"
        >
          <RobotIcon />
        </button>
      )} */}
      {/* חלונית הצ'אט */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-200 flex flex-col" style={{ minHeight: 420, maxHeight: 520 }}>
          <ChatbotHoneypot id="chatbot-hp-widget" value={honeypot} onChange={setHoneypot} />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <RobotIcon />
              <span className="font-bold text-blue-700">צ'אט AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none">×</button>
          </div>
          <div className="h-64 overflow-y-auto mb-2 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span className={msg.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"} style={{ borderRadius: 8, padding: 6, display: "inline-block", margin: 2 }}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-400">הבוט כותב...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex mt-auto">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="כתוב שאלה..."
              disabled={loading}
              maxLength={500}
              autoFocus
            />
            <button className="ml-2 bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50" onClick={sendMessage} disabled={loading}>
              שלח
            </button>
          </div>
        </div>
      )}
    </>
  );
} 