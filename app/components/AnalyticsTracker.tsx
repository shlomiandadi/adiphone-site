'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  inferCtaLocation,
  injectAttributionFields,
  isMailtoHref,
  isMainCta,
  isTelHref,
  isWhatsAppHref,
  persistAttribution,
  trackEvent,
  trackPageView,
} from '../../lib/tracking';

function resolveHref(anchor: HTMLAnchorElement) {
  return anchor.getAttribute('href') || anchor.href || '';
}

function linkLabel(el: Element) {
  return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
}

function handleDelegatedClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const clickable = target.closest('a,button,[data-cta],[data-package-name]');
  if (!(clickable instanceof HTMLElement)) return;

  const anchor = clickable.closest('a');
  const href = anchor ? resolveHref(anchor) : '';
  const location = inferCtaLocation(clickable);
  const packageName =
    clickable.getAttribute('data-package-name') ||
    clickable.closest('[data-package-name]')?.getAttribute('data-package-name') ||
    undefined;
  const label = linkLabel(clickable);

  if (href && isTelHref(href)) {
    trackEvent('phone_click', {
      link_url: href,
      cta_location: location,
      link_text: label,
    });
  } else if (href && isWhatsAppHref(href)) {
    trackEvent('whatsapp_click', {
      link_url: href,
      cta_location: location,
      link_text: label,
    });
  } else if (href && isMailtoHref(href)) {
    trackEvent('email_click', {
      link_url: href,
      cta_location: location,
      link_text: label,
    });
  }

  if (packageName) {
    trackEvent('pricing_package_click', {
      package_name: packageName,
      link_url: href || undefined,
      cta_location: location === 'other' ? 'pricing' : location,
      link_text: label,
    });
  }

  if (isMainCta(clickable, label)) {
    trackEvent('cta_click', {
      link_url: href || undefined,
      cta_location: location,
      link_text: label,
      package_name: packageName,
    });
  }
}

function syncFormFields() {
  document.querySelectorAll('form').forEach((form) => {
    injectAttributionFields(form);
  });
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const thankYouSent = useRef(false);

  useEffect(() => {
    persistAttribution();
    document.addEventListener('click', handleDelegatedClick, true);
    const observer = new MutationObserver(syncFormFields);
    observer.observe(document.body, { childList: true, subtree: true });
    syncFormFields();
    return () => {
      document.removeEventListener('click', handleDelegatedClick, true);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    persistAttribution();
    syncFormFields();
    if (lastPath.current && lastPath.current !== pathname) {
      trackPageView();
    }
    lastPath.current = pathname;

    if (pathname === '/thank-you') {
      if (!thankYouSent.current) {
        thankYouSent.current = true;
        trackEvent('thank_you', { form_name: 'thank_you' });
      }
    } else {
      thankYouSent.current = false;
    }
  }, [pathname]);

  return null;
}
