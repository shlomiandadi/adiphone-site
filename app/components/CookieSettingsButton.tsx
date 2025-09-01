"use client";

import React from 'react';

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      aria-label="הגדרות עוגיות"
      title="הגדרות עוגיות"
      className="fixed bottom-4 left-4 z-50 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors p-3"
      onClick={() => {
        try {
          window.dispatchEvent(new Event("open-cookie-settings"));
        } catch {
          // ignore
        }
      }}
    >
      {/* simple gear icon */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M11.828 1.999a1 1 0 0 1 1.343 0l1.2 1.082a1 1 0 0 0 .743.26l1.612-.12a1 1 0 0 1 1.05.78l.37 1.592a1 1 0 0 0 .5.645l1.432.77a1 1 0 0 1 .457 1.302l-.7 1.49a1 1 0 0 0 0 .842l.7 1.49a1 1 0 0 1-.457 1.302l-1.433.77a1 1 0 0 0-.5.645l-.369 1.592a1 1 0 0 1-1.05.78l-1.613-.12a1 1 0 0 0-.742.26l-1.2 1.082a1 1 0 0 1-1.343 0l-1.2-1.082a1 1 0 0 0-.743-.26l-1.612.12a1 1 0 0 1-1.05-.78l-.37-1.592a1 1 0 0 0-.5-.645l-1.432-.77a1 1 0 0 1-.457-1.302l.7-1.49a1 1 0 0 0 0-.842l-.7-1.49a1 1 0 0 1 .457-1.302l1.433-.77a1 1 0 0 0 .5-.645l.369-1.592a1 1 0 0 1 1.05-.78l1.613.12a1 1 0 0 0 .742-.26l1.2-1.082ZM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" clipRule="evenodd" />
      </svg>
    </button>
  );
}


