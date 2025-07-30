"use client";
import { useState, useRef, useEffect } from "react";

function RobotIcon() {
  // אייקון רובוט מודרני, לבן על רקע כחול עגול
  return (
    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#2563eb"/>
        <rect x="8" y="13" width="16" height="10" rx="5" fill="white"/>
        <circle cx="13" cy="18" r="1.5" fill="#2563eb"/>
        <circle cx="19" cy="18" r="1.5" fill="#2563eb"/>
        <rect x="15" y="7" width="2" height="5" rx="1" fill="white"/>
        <rect x="11" y="11" width="2" height="2" rx="1" fill="white"/>
        <rect x="19" y="11" width="2" height="2" rx="1" fill="white"/>
      </svg>
    </span>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setLoading(true);
    const res = await fetch("/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessages((msgs) => [
      ...msgs,
      { role: "bot", content: data.answer }
    ]);
    setInput("");
    setLoading(false);
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