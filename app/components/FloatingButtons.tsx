'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { FaWheelchair, FaTimes, FaFont, FaEye } from 'react-icons/fa';

// Robot Icon Component for Chatbot
function RobotIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="currentColor"/>
      <rect x="8" y="13" width="16" height="10" rx="5" fill="white"/>
      <circle cx="13" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="18" r="1.5" fill="currentColor"/>
      <rect x="15" y="7" width="2" height="5" rx="1" fill="white"/>
      <rect x="11" y="11" width="2" height="2" rx="1" fill="white"/>
      <rect x="19" y="11" width="2" height="2" rx="1" fill="white"/>
    </svg>
  );
}

export default function FloatingButtons() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const openCookieSettings = () => {
    try {
      window.dispatchEvent(new Event('open-cookie-settings'));
    } catch {
      // ignore
    }
  };
  
  // Chatbot states
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Accessibility states
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [cursorSize, setCursorSize] = useState('normal');

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved accessibility preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-fontSize');
    const savedHighContrast = localStorage.getItem('accessibility-highContrast');
    const savedHighlightLinks = localStorage.getItem('accessibility-highlightLinks');
    const savedCursorSize = localStorage.getItem('accessibility-cursorSize');

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
    if (savedHighContrast === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
    if (savedHighlightLinks === 'true') {
      setHighlightLinks(true);
      document.body.classList.add('highlight-links');
    }
    if (savedCursorSize) {
      setCursorSize(savedCursorSize);
      document.body.classList.add(`cursor-${savedCursorSize}`);
    }
  }, []);

  // Chatbot functions
  useEffect(() => {
    if (chatbotOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatbotOpen]);

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

  // Accessibility functions
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('accessibility-fontSize', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('accessibility-fontSize', newSize.toString());
  };

  const resetFontSize = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
    localStorage.removeItem('accessibility-fontSize');
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility-highContrast', newValue.toString());
  };

  const toggleHighlightLinks = () => {
    const newValue = !highlightLinks;
    setHighlightLinks(newValue);
    if (newValue) {
      document.body.classList.add('highlight-links');
    } else {
      document.body.classList.remove('highlight-links');
    }
    localStorage.setItem('accessibility-highlightLinks', newValue.toString());
  };

  const changeCursorSize = (size: string) => {
    document.body.classList.remove(`cursor-${cursorSize}`);
    setCursorSize(size);
    document.body.classList.add(`cursor-${size}`);
    localStorage.setItem('accessibility-cursorSize', size);
  };

  const resetAll = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
    localStorage.removeItem('accessibility-fontSize');

    setHighContrast(false);
    document.body.classList.remove('high-contrast');
    localStorage.removeItem('accessibility-highContrast');

    setHighlightLinks(false);
    document.body.classList.remove('highlight-links');
    localStorage.removeItem('accessibility-highlightLinks');

    document.body.classList.remove(`cursor-${cursorSize}`);
    setCursorSize('normal');
    document.body.classList.add('cursor-normal');
    localStorage.removeItem('accessibility-cursorSize');
  };

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {/* Spacer to prevent content from being hidden behind the fixed strip */}
        <div className="h-16 md:hidden" />
        
        {/* Chatbot Panel */}
        {chatbotOpen && (
          <div className="fixed inset-0 z-[99999] flex items-end justify-end p-4 pb-20 md:hidden">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setChatbotOpen(false)}
            />
            <div className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-sm max-h-[70vh] overflow-y-auto" dir="rtl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <RobotIcon />
                  </div>
                  <span className="font-bold text-purple-700">צ'אט AI</span>
                </div>
                <button
                  onClick={() => setChatbotOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="סגור"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <div className="h-64 overflow-y-auto mb-4 flex flex-col gap-2">
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
                  <button className="ml-2 bg-purple-600 text-white px-4 py-1 rounded disabled:opacity-50" onClick={sendMessage} disabled={loading}>
                    שלח
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Panel */}
        {accessibilityOpen && (
          <div className="fixed inset-0 z-[99999] flex items-end justify-end p-4 pb-20 md:hidden">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setAccessibilityOpen(false)}
            />
            <div className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-sm max-h-[70vh] overflow-y-auto" dir="rtl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaWheelchair className="w-5 h-5 text-orange-600" />
                  <span className="font-bold text-orange-700">הגדרות נגישות</span>
                </div>
                <button
                  onClick={() => setAccessibilityOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="סגור"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaFont className="w-4 h-4 text-orange-600" />
                    גודל גופן
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decreaseFontSize}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                      aria-label="הקטן גופן"
                    >
                      A-
                    </button>
                    <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                      {fontSize}px
                    </span>
                    <button
                      onClick={increaseFontSize}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                      aria-label="הגדל גופן"
                    >
                      A+
                    </button>
                    <button
                      onClick={resetFontSize}
                      className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm"
                    >
                      איפוס
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaEye className="w-4 h-4 text-orange-600" />
                    ניגודיות גבוהה
                  </h3>
                  <button
                    onClick={toggleHighContrast}
                    className={`w-full p-3 rounded-lg transition-colors text-sm ${
                      highContrast
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {highContrast ? '✓ מופעל - רקע שחור, טקסט לבן' : 'הפעל ניגודיות גבוהה'}
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">הדגשת קישורים</h3>
                  <button
                    onClick={toggleHighlightLinks}
                    className={`w-full p-3 rounded-lg transition-colors text-sm ${
                      highlightLinks
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {highlightLinks ? '✓ מופעל - קישורים מודגשים' : 'הפעל הדגשת קישורים'}
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">גודל סמן</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeCursorSize('small')}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        cursorSize === 'small' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      קטן
                    </button>
                    <button
                      onClick={() => changeCursorSize('normal')}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        cursorSize === 'normal' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      רגיל
                    </button>
                    <button
                      onClick={() => changeCursorSize('large')}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        cursorSize === 'large' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      גדול
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    onClick={resetAll}
                    className="w-full p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                  >
                    איפוס כל ההגדרות
                  </button>
                </div>
                <div>
                  <a
                    href="/accessibility-statement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm text-center block"
                  >
                    צפייה בתקנון נגישות
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div 
          className="fixed bottom-0 left-0 right-0 z-[99999] bg-white border-t border-gray-200 shadow-lg md:hidden"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-around items-center h-16">
              {/* WhatsApp Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <Link
                  href="https://wa.me/972509159951"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                  aria-label="פתח צ'אט בוואטסאפ"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs mt-1 text-gray-600">WhatsApp</span>
                </Link>
              </motion.div>

              {/* Phone Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <Link
                  href="tel:0509159951"
                  className="flex flex-col items-center"
                  aria-label="התקשר אלינו"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs mt-1 text-gray-600">התקשר</span>
                </Link>
              </motion.div>

              {/* Chatbot Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <button
                  onClick={() => setChatbotOpen(!chatbotOpen)}
                  className="flex flex-col items-center"
                  aria-label="פתח צ'אט AI"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <RobotIcon />
                    </div>
                  </div>
                  <span className="text-xs mt-1 text-gray-600">צ'אט AI</span>
                </button>
              </motion.div>

              {/* Cookie Settings Button (Mobile) */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <button
                  onClick={openCookieSettings}
                  className="flex flex-col items-center"
                  aria-label="הגדרות עוגיות"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                        <path d="M11.984 2a1 1 0 0 1 .993.883l.007.117v1.07a2.5 2.5 0 0 0 2.354 2.495l.146.005h1.07a1 1 0 0 1 .117 1.993l-.117.007h-1.07a4.5 4.5 0 0 1-4.493-4.354L11.984 2Zm-1.16 3.277a8 8 0 1 1-3.548 15.556 1 1 0 0 1-.64-1.265l.041-.11.335-.76a1 1 0 0 1 1.589-.354l.088.082.6.6a1 1 0 0 0 1.464-1.366l-.077-.082-1.2-1.2a1 1 0 0 1 .235-1.58l.111-.052 1.13-.452a1 1 0 0 0-.328-1.945l-.112.005h-.85a1 1 0 0 1-.988-1.16l.02-.112.2-.8a1 1 0 0 0-1.32-1.164l-.103.043-.8.4a1 1 0 0 1-1.216-1.56l.087-.067a7.966 7.966 0 0 1 2.652-1.192Z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs mt-1 text-gray-600">עוגיות</span>
                </button>
              </motion.div>

              {/* Accessibility Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <button
                  onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                  className="flex flex-col items-center"
                  aria-label="פתח הגדרות נגישות"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <FaWheelchair className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-xs mt-1 text-gray-600">נגישות</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
        <Link
          href="https://wa.me/972509159951"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-colors duration-200"
          aria-label="פתח צ'אט בוואטסאפ"
        >
          <span className="absolute -top-10 right-0 bg-black text-white text-sm py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            WhatsApp
          </span>
          <svg
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </Link>
      </motion.div>

      {/* Phone Button */}
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.4
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
        <Link
          href="tel:0509159951"
          className="relative flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-colors duration-200"
          aria-label="התקשר אלינו"
        >
          <span className="absolute -top-10 right-0 bg-black text-white text-sm py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            התקשר אלינו
          </span>
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </Link>
      </motion.div>

      {/* Chatbot Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.6
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
        <button
          onClick={() => setChatbotOpen(!chatbotOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg transition-colors duration-200"
          aria-label="פתח צ'אט AI"
        >
          <span className="absolute -top-10 right-0 bg-black text-white text-sm py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            צ'אט AI
          </span>
          <RobotIcon />
        </button>
      </motion.div>

      {/* Accessibility Button */}
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.8
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
        <button
          onClick={() => setAccessibilityOpen(!accessibilityOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg transition-colors duration-200"
          aria-label="פתח הגדרות נגישות"
        >
          <span className="absolute -top-10 right-0 bg-black text-white text-sm py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            נגישות
          </span>
          <FaWheelchair className="w-7 h-7 text-white" />
        </button>
      </motion.div>

      {/* Cookie Settings Button (Desktop) */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
        <button
          onClick={openCookieSettings}
          className="relative flex items-center justify-center w-14 h-14 bg-gray-900 hover:bg-gray-800 rounded-full shadow-lg transition-colors duration-200"
          aria-label="הגדרות עוגיות"
        >
          <span className="absolute -top-10 right-0 bg-black text-white text-sm py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            הגדרות עוגיות
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
            <path d="M11.984 2a1 1 0 0 1 .993.883l.007.117v1.07a2.5 2.5 0 0 0 2.354 2.495l.146.005h1.07a1 1 0 0 1 .117 1.993l-.117.007h-1.07a4.5 4.5 0 0 1-4.493-4.354L11.984 2Zm-1.16 3.277a8 8 0 1 1-3.548 15.556 1 1 0 0 1-.64-1.265l.041-.11.335-.76a1 1 0 0 1 1.589-.354l.088.082.6.6a1 1 0 0 0 1.464-1.366l-.077-.082-1.2-1.2a1 1 0 0 1 .235-1.58l.111-.052 1.13-.452a1 1 0 0 0-.328-1.945l-.112.005h-.85a1 1 0 0 1-.988-1.16l.02-.112.2-.8a1 1 0 0 0-1.32-1.164l-.103.043-.8.4a1 1 0 0 1-1.216-1.56l.087-.067a7.966 7.966 0 0 1 2.652-1.192Z" />
          </svg>
        </button>
      </motion.div>

      {/* Chatbot Panel for Desktop */}
      {chatbotOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-end p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setChatbotOpen(false)}
          />
          <div className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <RobotIcon />
                </div>
                <span className="font-bold text-purple-700">צ'אט AI</span>
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="סגור"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="h-64 overflow-y-auto mb-4 flex flex-col gap-2">
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
                <button className="ml-2 bg-purple-600 text-white px-4 py-1 rounded disabled:opacity-50" onClick={sendMessage} disabled={loading}>
                  שלח
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Panel for Desktop */}
      {accessibilityOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-end p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setAccessibilityOpen(false)}
          />
          <div className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaWheelchair className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-orange-700">הגדרות נגישות</span>
              </div>
              <button
                onClick={() => setAccessibilityOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="סגור"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaFont className="w-4 h-4 text-orange-600" />
                  גודל גופן
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontSize}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    aria-label="הקטן גופן"
                  >
                    A-
                  </button>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    aria-label="הגדל גופן"
                  >
                    A+
                  </button>
                  <button
                    onClick={resetFontSize}
                    className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm"
                  >
                    איפוס
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaEye className="w-4 h-4 text-orange-600" />
                  ניגודיות גבוהה
                </h3>
                <button
                  onClick={toggleHighContrast}
                  className={`w-full p-3 rounded-lg transition-colors text-sm ${
                    highContrast
                      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {highContrast ? '✓ מופעל - רקע שחור, טקסט לבן' : 'הפעל ניגודיות גבוהה'}
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">הדגשת קישורים</h3>
                <button
                  onClick={toggleHighlightLinks}
                  className={`w-full p-3 rounded-lg transition-colors text-sm ${
                    highlightLinks
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {highlightLinks ? '✓ מופעל - קישורים מודגשים' : 'הפעל הדגשת קישורים'}
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">גודל סמן</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeCursorSize('small')}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      cursorSize === 'small' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    קטן
                  </button>
                  <button
                    onClick={() => changeCursorSize('normal')}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      cursorSize === 'normal' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    רגיל
                  </button>
                  <button
                    onClick={() => changeCursorSize('large')}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      cursorSize === 'large' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    גדול
                  </button>
                </div>
              </div>
                              <div>
                  <button
                    onClick={resetAll}
                    className="w-full p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                  >
                    איפוס כל ההגדרות
                  </button>
                </div>
                <div>
                  <a
                    href="/accessibility-statement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm text-center block"
                  >
                    צפייה בתקנון נגישות
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
} 