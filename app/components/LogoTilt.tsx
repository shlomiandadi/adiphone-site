'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type LogoTiltProps = {
  width: number;
  height: number;
  children: ReactNode;
};

/**
 * Shared CSS 3D tilt. The idle motion is stylesheet-only.
 * Pointer tracking downloads after the load event and an idle callback, and only for a fine pointer.
 */
export default function LogoTilt({ width, height, children }: LogoTiltProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let disposed = false;
    let unbind = () => {};
    let idleId = 0;
    let fallbackId = 0;

    const clearIdle = () => {
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
      idleId = 0;
      if (fallbackId) window.clearTimeout(fallbackId);
      fallbackId = 0;
    };

    const loadMotion = () => {
      if (disposed) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;
      const run = () => {
        if (disposed) return;
        void import(/* webpackChunkName: "logo-tilt" */ './logoTiltMotion').then((mod) => {
          if (disposed) return;
          unbind = mod.bindLogoTilt(el);
        });
      };
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(run, { timeout: 10000 });
      } else {
        fallbackId = window.setTimeout(run, 250);
      }
    };

    if (document.readyState === 'complete') loadMotion();
    else window.addEventListener('load', loadMotion, { once: true });

    return () => {
      disposed = true;
      clearIdle();
      unbind();
      window.removeEventListener('load', loadMotion);
    };
  }, []);

  return (
    <span ref={ref} className="brand-lockup logo-tilt" style={{ width, height }}>
      <span className="logo-tilt-plane">{children}</span>
    </span>
  );
}
