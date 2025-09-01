

"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ConsentCategories = {
  necessary: boolean; // always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

type ConsentState = {
  categories: ConsentCategories;
  timestamp: number;
  version: number;
};

const CONSENT_COOKIE_NAME = "cookie_consent_v1";
const CONSENT_VERSION = 1;

function readConsent(): ConsentState | null {
  try {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
      ?.split("=")[1];
    if (!value) return null;
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as ConsentState;
    if (!parsed?.categories) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  const encoded = encodeURIComponent(JSON.stringify(state));
  // 180 days expiry
  const maxAgeSeconds = 60 * 60 * 24 * 180;
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function updateGtagConsent(categories: ConsentCategories) {
  // Default deny handled in layout via Script beforeInteractive; here we update per user choice
  const analytics = categories.analytics ? "granted" : "denied";
  const ad = categories.marketing ? "granted" : "denied";
  const functionality = categories.functional ? "granted" : "denied";
  // security_storage stays granted for essential site operation
  try {
    // @ts-ignore
    window.gtag?.("consent", "update", {
      ad_storage: ad,
      analytics_storage: analytics,
      functionality_storage: functionality,
      security_storage: "granted",
    });
  } catch {
    // no-op
  }
}

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  // Initialize on mount and on route change to prevent re-opening when consent exists
  useEffect(() => {
    const consent = readConsent();
    if (consent) {
      setCategories({ ...consent.categories, necessary: true });
      setVisible(false);
      updateGtagConsent(consent.categories);
    } else {
      setVisible(true);
    }
  }, [pathname]);

  // Listen for external open requests (cookie icon)
  useEffect(() => {
    const openHandler = () => {
      setShowCustomize(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", openHandler as EventListener);
    return () => window.removeEventListener("open-cookie-settings", openHandler as EventListener);
  }, []);

  function persistAndClose(next: ConsentCategories) {
    const state: ConsentState = {
      categories: { ...next, necessary: true },
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    writeConsent(state);
    updateGtagConsent(state.categories);
    try {
      window.dispatchEvent(
        new CustomEvent("cookie-consent-changed", { detail: state })
      );
    } catch {
      // ignore
    }
    setVisible(false);
    setShowCustomize(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 pb-20 md:pb-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2">שימוש בעוגיות (Cookies)</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            אנו משתמשים בעוגיות הכרחיות לתפקוד האתר. בכפוף להסכמתך נשתמש גם בעוגיות למדידות ובשיווק. ניתן לשנות העדפה בכל עת.
            קרא עוד ב־
            <a href="/privacy-policy" className="text-blue-600 hover:underline mr-1">מדיניות הפרטיות</a>.
          </p>

          {showCustomize && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <div className="font-medium">חיוניות</div>
                  <div className="text-xs text-gray-500">תמיד פעיל. נדרש להפעלת האתר.</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">חובה</span>
              </div>
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 cursor-pointer select-none">
                <div>
                  <div className="font-medium">אנליטיקה</div>
                  <div className="text-xs text-gray-500">שיפור ביצועים ומדידות.</div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={categories.analytics}
                  onChange={(e) => setCategories((c) => ({ ...c, analytics: e.target.checked }))}
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 cursor-pointer select-none">
                <div>
                  <div className="font-medium">שיווק</div>
                  <div className="text-xs text-gray-500">תוכן מותאם ומעקב פרסומי.</div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={categories.marketing}
                  onChange={(e) => setCategories((c) => ({ ...c, marketing: e.target.checked }))}
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 cursor-pointer select-none">
                <div>
                  <div className="font-medium">פונקציונליות</div>
                  <div className="text-xs text-gray-500">שיפור חווית המשתמש.</div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={categories.functional}
                  onChange={(e) => setCategories((c) => ({ ...c, functional: e.target.checked }))}
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
            {!showCustomize && (
              <>
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() =>
                    persistAndClose({ necessary: true, analytics: false, marketing: false, functional: false })
                  }
                >
                  דחיית עוגיות לא חיוניות
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setShowCustomize(true)}
                >
                  התאמה אישית
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={() =>
                    persistAndClose({ necessary: true, analytics: true, marketing: true, functional: true })
                  }
                >
                  אישור הכל
                </button>
              </>
            )}
            {showCustomize && (
              <>
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowCustomize(false)}
                >
                  חזרה
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => persistAndClose(categories)}
                >
                  שמירת העדפות
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


