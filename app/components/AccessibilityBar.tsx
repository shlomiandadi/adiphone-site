'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  TextSizeIcon, 
  ContrastIcon, 
  CursorIcon, 
  KeyboardIcon,
  AccessibilityIcon,
  CloseIcon
} from './icons';

interface AccessibilityOptions {
  fontSize: number;
  highContrast: boolean;
  largeCursor: boolean;
  keyboardNavigation: boolean;
}

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AccessibilityOptions>({
    fontSize: 100,
    highContrast: false,
    largeCursor: false,
    keyboardNavigation: false,
  });

  useEffect(() => {
    // Load saved preferences
    const savedOptions = localStorage.getItem('accessibilityOptions');
    if (savedOptions) {
      setOptions(JSON.parse(savedOptions));
      applyAccessibilityOptions(JSON.parse(savedOptions));
    }
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dialog = document.querySelector('[role="dialog"]');
      const button = document.querySelector('[aria-label="פתח הגדרות נגישות"]');
      
      if (isOpen && dialog && button && 
          !dialog.contains(e.target as Node) && 
          !button.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const applyAccessibilityOptions = (newOptions: AccessibilityOptions) => {
    document.documentElement.style.fontSize = `${newOptions.fontSize}%`;
    document.body.classList.toggle('high-contrast', newOptions.highContrast);
    document.body.classList.toggle('large-cursor', newOptions.largeCursor);
    document.body.classList.toggle('keyboard-navigation', newOptions.keyboardNavigation);
  };

  const handleOptionChange = (option: keyof AccessibilityOptions, value: any) => {
    const newOptions = { ...options, [option]: value };
    setOptions(newOptions);
    localStorage.setItem('accessibilityOptions', JSON.stringify(newOptions));
    applyAccessibilityOptions(newOptions);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-[60]"
        style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
        aria-label="פתח הגדרות נגישות"
      >
        <AccessibilityIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="relative z-[60]" aria-modal="true" role="dialog">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">הגדרות נגישות</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="סגור"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <TextSizeIcon className="w-5 h-5" />
                    <span>גודל טקסט</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOptionChange('fontSize', Math.max(50, options.fontSize - 10))}
                      className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span>{options.fontSize}%</span>
                    <button
                      onClick={() => handleOptionChange('fontSize', Math.min(200, options.fontSize + 10))}
                      className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <ContrastIcon className="w-5 h-5" />
                    <span>ניגודיות גבוהה</span>
                  </label>
                  <button
                    onClick={() => handleOptionChange('highContrast', !options.highContrast)}
                    className={`px-4 py-2 rounded ${
                      options.highContrast
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {options.highContrast ? 'פעיל' : 'כבוי'}
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <CursorIcon className="w-5 h-5" />
                    <span>סמן עכבר גדול</span>
                  </label>
                  <button
                    onClick={() => handleOptionChange('largeCursor', !options.largeCursor)}
                    className={`px-4 py-2 rounded ${
                      options.largeCursor
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {options.largeCursor ? 'פעיל' : 'כבוי'}
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <KeyboardIcon className="w-5 h-5" />
                    <span>ניווט מקלדת</span>
                  </label>
                  <button
                    onClick={() => handleOptionChange('keyboardNavigation', !options.keyboardNavigation)}
                    className={`px-4 py-2 rounded ${
                      options.keyboardNavigation
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {options.keyboardNavigation ? 'פעיל' : 'כבוי'}
                  </button>
                </div>

                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => {
                      const defaultOptions = {
                        fontSize: 100,
                        highContrast: false,
                        largeCursor: false,
                        keyboardNavigation: false,
                      };
                      setOptions(defaultOptions);
                      localStorage.setItem('accessibilityOptions', JSON.stringify(defaultOptions));
                      applyAccessibilityOptions(defaultOptions);
                    }}
                    className="w-full px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    איפוס כל ההגדרות
                  </button>
                </div>

                <div className="mt-6">
                  <h3 className="font-bold mb-2">תקנון נגישות</h3>
                  <p className="text-sm text-gray-600">
                    האתר שלנו מחויב לספק חווית גלישה נגישה לכולם. אנו עושים מאמצים מתמידים לשפר את הנגישות של האתר ולעמוד בתקנים בינלאומיים לנגישות אתרים.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    אם יש לך הצעות לשיפור הנגישות או שאתה נתקל בבעיות, אנא צור איתנו קשר.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 