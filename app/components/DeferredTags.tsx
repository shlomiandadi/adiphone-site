'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ensureGa4Config } from '../../lib/deferredTags';
import { flushMetaLead, trackMetaPageViewIfChanged } from '../../lib/tracking';
import {
  AHREFS_ANALYTICS_KEY,
  AHREFS_ANALYTICS_SRC,
  isThankYouPath,
  readConsentFlags,
  resolveMetaPixelId,
  shouldLoadAhrefs,
  shouldLoadMetaPixel,
  shouldTrackMetaPageView,
} from '../../lib/thirdPartyTags';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
const TIMEOUT_MS = 7000;

type Props = {
  gaId: string;
  pixelId?: string;
};

function isThankYou(pathname: string | null) {
  return isThankYouPath(pathname);
}

function injectScript(src: string) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function loadGa4(gaId: string) {
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
}

function loadMetaPixel(pixelId: string) {
  if (!pixelId || window.__TW_PIXEL_LOADED) return;
  window.__TW_PIXEL_LOADED = true;
  const trackPageView = shouldTrackMetaPageView(window.location.pathname);
  window.__TW_LAST_META_PATH = window.location.pathname;
  const boot = document.createElement('script');
  boot.text = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq.disablePushState = true;
    fbq('init', ${JSON.stringify(pixelId)});
    ${trackPageView ? "fbq('track', 'PageView');" : ''}
  `;
  document.head.appendChild(boot);
}

function loadAhrefs() {
  if (window.__TW_AHREFS_LOADED) return;
  if (document.querySelector(`script[src="${AHREFS_ANALYTICS_SRC}"]`)) {
    window.__TW_AHREFS_LOADED = true;
    return;
  }
  window.__TW_AHREFS_LOADED = true;
  const script = document.createElement('script');
  script.src = AHREFS_ANALYTICS_SRC;
  script.async = true;
  script.setAttribute('data-key', AHREFS_ANALYTICS_KEY);
  document.head.appendChild(script);
}

function loadConsentGatedTags(pixelId?: string) {
  const consent = readConsentFlags(document.cookie);
  const hostname = window.location.hostname;
  if (shouldLoadMetaPixel(hostname, consent)) {
    loadMetaPixel(resolveMetaPixelId(pixelId));
  }
  if (shouldLoadAhrefs(hostname, consent)) {
    loadAhrefs();
  }
  flushMetaLead();
  trackMetaPageViewIfChanged(window.location.pathname);
}

export default function DeferredTags({ gaId, pixelId }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const onConsent = () => {
      if (!window.__TW_TAGS_LOADED) return;
      loadConsentGatedTags(pixelId);
    };
    window.addEventListener('cookie-consent-changed', onConsent);
    return () => window.removeEventListener('cookie-consent-changed', onConsent);
  }, [pixelId]);

  useEffect(() => {
    if (window.__TW_TAGS_LOADED) {
      loadConsentGatedTags(pixelId);
      return;
    }

    let idleId = 0;
    let timerId = 0;
    let cancelled = false;

    const run = () => {
      if (cancelled || window.__TW_TAGS_LOADED) return;
      detach();
      loadGa4(gaId);
      loadConsentGatedTags(pixelId);
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
  }, [gaId, pathname, pixelId]);

  return null;
}
