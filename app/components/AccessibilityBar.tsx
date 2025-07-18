'use client';

import { useState } from 'react';

export default function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
    document.documentElement.style.fontSize = `${Math.min(fontSize + 2, 24)}px`;
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
    document.documentElement.style.fontSize = `${Math.max(fontSize - 2, 12)}px`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">נגישות:</span>
          <button
            onClick={increaseFontSize}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="הגדל גופן"
          >
            A+
          </button>
          <button
            onClick={decreaseFontSize}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="הקטן גופן"
          >
            A-
          </button>
          <button
            onClick={toggleHighContrast}
            className={`px-3 py-1 rounded transition-colors ${
              highContrast
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            aria-label="החלף ניגודיות גבוהה"
          >
            ניגודיות גבוהה
          </button>
        </div>
        <div className="text-gray-600">
          <span>גודל גופן נוכחי: {fontSize}px</span>
        </div>
      </div>
    </div>
  );
} 