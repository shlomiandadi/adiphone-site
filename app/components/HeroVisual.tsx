'use client';

import { useEffect, useRef } from 'react';

export default function HeroVisual() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const start = () => {
      if (cancelled || motion.matches || !hostRef.current) return;
      import('./hero-particles').then(({ startHeroParticles }) => {
        if (cancelled || motion.matches || !hostRef.current) return;
        cleanup = startHeroParticles(hostRef.current);
      });
    };

    const arm = () => {
      if (cancelled || motion.matches) return;
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(start, { timeout: 3500 });
      } else {
        timeoutId = window.setTimeout(start, 1);
      }
    };

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });

    const onMotionChange = () => {
      if (motion.matches) {
        cleanup?.();
        cleanup = undefined;
        return;
      }
      arm();
    };
    motion.addEventListener?.('change', onMotionChange);

    return () => {
      cancelled = true;
      window.removeEventListener('load', arm);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      motion.removeEventListener?.('change', onMotionChange);
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 z-0" aria-hidden="true" />;
}
