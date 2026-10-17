'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ComponentType } from 'react';

const AccessibilityBar = dynamic(() => import('./AccessibilityBar'), { ssr: false });
const AnalyticsTracker = dynamic(() => import('./AnalyticsTracker'), { ssr: false });
const ChatbotWidget = dynamic(() => import('./ChatbotWidget'), { ssr: false });

function useAfterIdle(timeout: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const timer = window.setTimeout(start, timeout);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [timeout]);
  return ready;
}

function AfterIdle({ timeout, Component }: { timeout: number; Component: ComponentType }) {
  const ready = useAfterIdle(timeout);
  if (!ready) return null;
  return <Component />;
}

export function DeferredAccessibilityBar() {
  return <AfterIdle timeout={4000} Component={AccessibilityBar} />;
}

export function DeferredAnalyticsTracker() {
  return <AfterIdle timeout={4500} Component={AnalyticsTracker} />;
}

export function DeferredChatbotWidget() {
  return <AfterIdle timeout={5000} Component={ChatbotWidget} />;
}
