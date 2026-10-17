'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ensureGa4Config } from '../../lib/deferredTags';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
const TIMEOUT_MS = 7000;

type Props = {
  gaId: string;
  gtmId: string;
  pixelId?: string;
};

function isThankYou(pathname: string | null) {
  return pathname === '/thank-you' || Boolean(pathname?.startsWith('/thank-you?'));
}

function injectScript(src: string) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function loadTags(gaId: string, gtmId: string, pixelId?: string) {
  if (window.__TW_TAGS_LOADED) return;
  window.__TW_TAGS_LOADED = true;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  window.__TW_GA4_CONFIGURED = ensureGa4Config(
    window.dataLayer,
    window.gtag,
    gaId,
    Boolean(window.__TW_GA4_CONFIGURED)
  );

  injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const firstScript = document.getElementsByTagName('script')[0];
  const gtm = document.createElement('script');
  gtm.async = true;
  gtm.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  firstScript?.parentNode?.insertBefore(gtm, firstScript);

  if (!pixelId || window.__TW_PIXEL_LOADED) return;
  window.__TW_PIXEL_LOADED = true;
  const boot = document.createElement('script');
  boot.text = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', ${JSON.stringify(pixelId)});
    fbq('track', 'PageView');
  `;
  document.head.appendChild(boot);
}

export default function DeferredTags({ gaId, gtmId, pixelId }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.__TW_TAGS_LOADED) return;

    let idleId = 0;
    let timerId = 0;
    let cancelled = false;

    const run = () => {
      if (cancelled || window.__TW_TAGS_LOADED) return;
      detach();
      loadTags(gaId, gtmId, pixelId);
    };

    const onInteract = (event: Event) => {
      if (!event.isTrusted) return;
      if (event.type === 'scroll' && window.scrollY <= 0) return;
      run();
    };

    const detach = () => {
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, onInteract);
      }
      if (timerId) window.clearTimeout(timerId);
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      timerId = 0;
      idleId = 0;
    };

    if (isThankYou(pathname)) {
      run();
      return () => {
        cancelled = true;
      };
    }

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, onInteract, { passive: true });
    }

    timerId = window.setTimeout(() => {
      timerId = 0;
      if (cancelled || window.__TW_TAGS_LOADED) return;
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(() => {
          idleId = 0;
          run();
        }, { timeout: 1000 });
      } else {
        run();
      }
    }, TIMEOUT_MS);

    return () => {
      cancelled = true;
      detach();
    };
  }, [gaId, gtmId, pathname, pixelId]);

  return null;
}
