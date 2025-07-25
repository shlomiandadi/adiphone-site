'use client';

import { useState, useEffect } from 'react';
import { FaWheelchair, FaFont, FaEye, FaMousePointer, FaKeyboard, FaTimes } from 'react-icons/fa';

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [cursorSize, setCursorSize] = useState('normal');

  // Load saved preferences from localStorage
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
    // Reset font size
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
    localStorage.removeItem('accessibility-fontSize');

    // Reset high contrast
    setHighContrast(false);
    document.body.classList.remove('high-contrast');
    localStorage.removeItem('accessibility-highContrast');

    // Reset highlight links
    setHighlightLinks(false);
    document.body.classList.remove('highlight-links');
    localStorage.removeItem('accessibility-highlightLinks');

    // Reset cursor size
    document.body.classList.remove(`cursor-${cursorSize}`);
    setCursorSize('normal');
    document.body.classList.add('cursor-normal');
    localStorage.removeItem('accessibility-cursorSize');
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-16 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="פתח הגדרות נגישות"
        title="הגדרות נגישות"
      >
        <FaWheelchair className="w-6 h-6" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaWheelchair className="w-5 h-5 text-blue-600" />
                הגדרות נגישות
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="סגור"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Font Size */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaFont className="w-4 h-4 text-blue-600" />
                  גודל גופן
                </h3>
                <div className="flex items-center gap-3">
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
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm"
                  >
                    איפוס
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaEye className="w-4 h-4 text-blue-600" />
                  ניגודיות גבוהה
                </h3>
                <button
                  onClick={toggleHighContrast}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    highContrast
                      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {highContrast ? '✓ מופעל - רקע שחור, טקסט לבן' : 'הפעל ניגודיות גבוהה'}
                </button>
              </div>

              {/* Highlight Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMousePointer className="w-4 h-4 text-blue-600" />
                  הדגשת קישורים
                </h3>
                <button
                  onClick={toggleHighlightLinks}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    highlightLinks
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {highlightLinks ? '✓ מופעל' : 'הדגש קישורים'}
                </button>
              </div>

              {/* Cursor Size */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMousePointer className="w-4 h-4 text-blue-600" />
                  גודל סמן
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => changeCursorSize('small')}
                    className={`p-2 rounded-lg transition-colors ${
                      cursorSize === 'small'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    קטן
                  </button>
                  <button
                    onClick={() => changeCursorSize('normal')}
                    className={`p-2 rounded-lg transition-colors ${
                      cursorSize === 'normal'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    רגיל
                  </button>
                  <button
                    onClick={() => changeCursorSize('large')}
                    className={`p-2 rounded-lg transition-colors ${
                      cursorSize === 'large'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    גדול
                  </button>
                </div>
              </div>

              {/* Keyboard Navigation Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaKeyboard className="w-4 h-4 text-blue-600" />
                  ניווט במקלדת
                </h3>
                <p className="text-sm text-gray-700">
                  השתמש ב-Tab לניווט, Enter לבחירה, ו-Esc לסגירה
                </p>
              </div>

              {/* Reset All */}
              <button
                onClick={resetAll}
                className="w-full p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
              >
                איפוס כל ההגדרות
              </button>

              <div className="mb-4">
                  <button
                    className="accessibility-statement-btn w-full py-2 px-4 rounded border border-yellow-400 text-yellow-400 font-bold hover:bg-yellow-100 hover:text-black transition-colors mb-2"
                    onClick={() => window.open('/accessibility-statement', '_blank', 'noopener')}
                  >
                    הצהרת נגישות
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 